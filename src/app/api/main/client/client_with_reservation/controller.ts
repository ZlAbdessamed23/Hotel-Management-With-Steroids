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
} from "@/lib/error_handler/customerErrors";
import { throwAppropriateError } from "@/lib/error_handler/throwError";
import { updateClientCheckInStatistics } from "@/app/api/main/statistics/statistics";


const prisma = new PrismaClient();

export async function addClientWithReservation(
  data: ClientReservationData,
  hotelId: string,
  employeeId: string
): Promise<ClientReservationResult> {
  try {
    return await prisma.$transaction(async (prisma) => {
      // Check if the hotel exists, get its subscription plan, and count clients in one query
      const [hotel, clientCount] = await Promise.all([
        prisma.hotel.findUnique({
          where: { id: hotelId },
          include: {
            subscription: {
              include: {
                plan: true,
              },
            },
          },
        }),
        prisma.client.count({ where: { hotelId } }),
      ]);

      if (!hotel) {
        throw new ValidationError("hotel non trouvé");
      }
      if (!hotel.subscription || !hotel.subscription.plan) {
        throw new ValidationError("Hotel n'a pas d'abonnement actif");
      }

      // Check if the client limit has been reached
      const maxClients = hotel.subscription.plan.maxClients;
      if (clientCount >= maxClients) {
        throw new LimitExceededError(
          `Le nombre Maximum des clients pour ce plan est déja atteint`
        );
      }

      // Check if the room exists and is available
      const room = await prisma.room.findFirst({
        where: {
          hotelId: hotelId,
          number: data.roomNumber,
          type: data.roomType,
          status: RoomStatus.disponible,
        },
      });

      if (!room) {
        throw new NotFoundError("Chambre non trouvée ou déja réservée ou elle est en panne ou hors service");
      }

      // Calculate totalPrice
      const totalPrice = data.totalDays * room.price.toNumber();

      // Create the client and reservation in a single query
      let result: ClientReservationResult;

if (data.state === ReservationState.en_attente) {
  const createdClient = await prisma.client.create({
    data: {
      fullName: data.fullName,
      dateOfBirth: data.dateOfBirth,
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
      employeeId,
      pendingReservation: {
        create: {
          roomNumber: data.roomNumber,
          roomType: data.roomType,
          startDate: data.startDate,
          endDate: data.endDate,
          totalDays: data.totalDays,
          totalPrice,
          unitPrice: room.price.toNumber(),
          state: data.state,
          discoveryChannel: data.discoveryChannel,
          source: data.source,
          hotelId,
          employeeId,
          roomId: room.id,
        },
      },
    },
    include: {
      reservations: true,
      pendingReservation: true,
    },
  });

  result = { client: createdClient };
} else {
  const createdClient = await prisma.client.create({
    data: {
      fullName: data.fullName,
      dateOfBirth: data.dateOfBirth,
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
      employeeId,
      reservations: {
        create: {
          roomNumber: data.roomNumber,
          roomType: data.roomType,
          startDate: data.startDate,
          endDate: data.endDate,
          totalDays: data.totalDays,
          totalPrice,
          unitPrice: room.price.toNumber(),
          state: data.state,
          discoveryChannel: data.discoveryChannel,
          source: data.source,
          hotelId,
          employeeId,
          roomId: room.id,
        },
      },
    },
    include: {
      reservations: true,
      pendingReservation: true,
    },
  });

  result = { client: createdClient };
}
      

      // Update room status to reservee
      await prisma.room.update({
        where: { id: room.id },
        data: { status: RoomStatus.reservee },
      });
      if (data.state === ReservationState.valide) {
        await updateClientCheckInStatistics(
          hotelId,
          null,
          data.gender,
          data.dateOfBirth,
          null,
          data.clientOrigin,
          totalPrice,
          prisma,
          true
        );
      }
      return result;
    });
  } catch (error) {
    throwAppropriateError(error);
  }
}

export async function getClientsWithReservations(
  hotelId: string
): Promise<ClientsWithReservations> {
  try {
    const clients = await prisma.client.findMany({
      where: { hotelId: hotelId },
      select : {
        fullName : true,
        address : true,
        email : true,
        phoneNumber : true,
        id : true,
        identityCardNumber : true,
        gender : true,
        dateOfBirth : true ,
        clientOrigin : true,
        kidsNumber : true,
        nationality : true,
        membersNumber : true,
        hotelId : true,
        createdAt : true,
        reservations : {
          select : {
            id:true,
            roomNumber : true,
            roomType : true,
            createdAt : true,
            totalDays : true,
            totalPrice : true , 
            currentOccupancy : true,
            discoveryChannel : true,
             source : true,
             state : true,
             startDate : true,
             endDate : true,
             unitPrice : true
          }
        }
        
      }
    });
    return { clients };
  } catch (error) {
    throwAppropriateError(error);
  }
}
export function checkReceptionistRole(roles: UserRole[]) {
  if (
    !roles.includes(UserRole.receptionist) &&
    !roles.includes(UserRole.reception_Manager)
  ) {
    throw new ValidationError(
      "Sauf le réceptiontist et le réceptionist manager peut faire cette action"
    );
  }
}

export function checkReceptionistAdminRole(roles: UserRole[]) {
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