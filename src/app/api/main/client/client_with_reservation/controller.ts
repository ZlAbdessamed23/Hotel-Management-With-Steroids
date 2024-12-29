import {
  PrismaClient,
  UserRole,
  RoomStatus,
  ReservationState,
} from "@prisma/client";
import {
  ClientReservationData,
  ClientReservationResult,
  ClientsWithReservations,
} from "@/app/api/main/client/client_with_reservation/types";
import {
  ValidationError,
  LimitExceededError,
  NotFoundError,
  ConflictError,
} from "@/lib/error_handler/customerErrors";
import { throwAppropriateError } from "@/lib/error_handler/throwError";
import { updateClientCheckInStatistics } from "@/app/api/main/statistics/statistics";


import prisma from "@/lib/prisma/prismaClient";

export async function addClientWithReservation(
  data: ClientReservationData,
  hotelId: string, 
  employeeId: string
 ): Promise<ClientReservationResult> {
  try {
    return await prisma.$transaction(async (prisma) => {
      // Check hotel exists with subscription
      const [hotel, clientCount] = await Promise.all([
        prisma.hotel.findUnique({
          where: { id: hotelId },
          include: {
            subscription: {
              include: {
                plan: true
              }
            }
          }
        }),
        prisma.client.count({ where: { hotelId } })
      ]);
 
      if (!hotel) throw new ValidationError("Hotel non trouvé");
      if (!hotel.subscription?.plan) throw new ValidationError("Hotel n'a pas d'abonnement actif");
 
      // Check client limit
      if (clientCount >= hotel.subscription.plan.maxClients) {
        throw new LimitExceededError("Le nombre Maximum des clients pour ce plan est déja atteint");
      }
 
      // Check room availability with locking
      const room = await prisma.room.findFirst({
        where: {
          hotelId,
          number: data.roomNumber,
          type: data.roomType,
          
        },
        
      });
 
      if (!room) {
        throw new NotFoundError("Chambre non trouvée e");
      }
      if (room.status !== RoomStatus.disponible) {
        throw new ConflictError("La chambre est déjà réservée, en panne ou hors service. Veuillez choisir une autre chambre.");
      }
      
      const totalDays = Math.ceil((new Date(data.endDate).getTime() - new Date(data.startDate).getTime()) / (1000 * 60 * 60 * 24));
      if (totalDays < 0) {
        throw new ValidationError("La durée de réservation est invalide. La date de fin doit être supérieure à la date de début.");
      }
      
      const totalPrice = totalDays * room.price.toNumber();
 
      const clientData = {
        fullName: data.fullName,
        dateOfBirth: new Date(data.dateOfBirth),
        phoneNumber: data.phoneNumber,
        email: data.email,
        membersNumber: data.membersNumber,
        kidsNumber: data.kidsNumber,
        identityCardNumber: data.identityCardNumber,
        address: data.address,
        nationality: data.nationality,
        clientOrigin: data.clientOrigin,
        gender: data.gender,
        hotelId,
        employeeId
      };
 
      const reservationData = {
        roomNumber: data.roomNumber,
        roomType: data.roomType,
        startDate: data.startDate,
        endDate: data.endDate,
        totalDays:totalDays,
        totalPrice,
        unitPrice: room.price.toNumber(),
        state: data.state,
        discoveryChannel: data.discoveryChannel,
        source: data.source,
        hotelId,
        employeeId,
        roomId: room.id
      };
 
      const [createdClient, updatedRoom] = await Promise.all([
        prisma.client.create({
          data: {
            ...clientData,
            ...(data.state === ReservationState.en_attente
              ? {
                  pendingReservation: {
                    create: reservationData
                  }
                }
              : {
                  reservations: {
                    create: reservationData
                  }
                }
            )
          },
          include: {
            reservations: true,
            pendingReservation: true
          }
        }),
        
        ...(data.state !== ReservationState.en_attente 
          ? [prisma.room.update({
              where: { id: room.id },
              data: { status: RoomStatus.reservee }
            })]
          : [])
      ]);
 
      if (data.state === ReservationState.valide) {
        await updateClientCheckInStatistics(
          hotelId,
          null,
          data.gender,
          new Date(data.dateOfBirth),
          null,
          data.clientOrigin,
          0,
          totalPrice,
          prisma,
          true
        );
      }
      
      return { client: createdClient };
    });
 
  } catch (error) {
   throwAppropriateError(error)
  }
 }

 export async function getClientsWithReservations(
  hotelId: string
): Promise<ClientsWithReservations> {
  try {
    const clients = await prisma.client.findMany({
      where: { hotelId: hotelId },
      select: {
        fullName: true,
        address: true,
        email: true,
        phoneNumber: true,
        id: true,
        identityCardNumber: true,
        gender: true,
        dateOfBirth: true,
        clientOrigin: true,
        kidsNumber: true,
        nationality: true,
        membersNumber: true,
        createdAt: true,
        reservations: {
          select: {
            id: true,
            roomNumber: true,
            roomType: true,
            createdAt: true,
            totalDays: true,
            totalPrice: true,
            currentOccupancy: true,
            discoveryChannel: true,
            source: true,
            state: true,
            startDate: true,
            endDate: true,
            unitPrice: true
          }
        },
        pendingReservation: true // Add this to check pending reservations
      }
    });

    // Filter out clients with only pending reservations
    const filteredClients = clients.filter(client => {
      // If client has no pending reservations, keep them
      if (client.pendingReservation.length === 0) {
        return true;
      }
      
      // If client has pending reservations but also has regular reservations, keep them
      if (client.pendingReservation.length > 0 && client.reservations.length > 0) {
        return true;
      }
      
      // Otherwise (has only pending reservations), filter them out
      return false;
    });

    // Remove pendingReservation field from the response to match the type
    const finalClients = filteredClients.map(({ pendingReservation, ...client }) => client);

    return { clients: finalClients };
  } catch (error) {
    throwAppropriateError(error);
  }
}
export function checkReceptionistReceptionManagerRole(roles: UserRole[]) {
  if (
    !roles.includes(UserRole.receptionist) &&
    !roles.includes(UserRole.reception_Manager)
  ) {
    throw new ValidationError(
      "Sauf le réceptiontist et le réceptionist manager peut faire cette action"
    );
  }
}

export function checkReceptionistReceptionManagerAdminRole(roles: UserRole[]) {
  if (
    !roles.includes(UserRole.receptionist) &&
    !roles.includes(UserRole.admin) &&
    !roles.includes(UserRole.reception_Manager)
  ) {
    throw new ValidationError(
      "Sauf le réceptiontist, le réceptionist manager et l'administrateur peut faire cette action"
    );
  }
}
