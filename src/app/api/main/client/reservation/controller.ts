import { UserRole, RoomStatus, ReservationState } from "@prisma/client";
import prisma from "@/lib/prisma/prismaClient";
import {
  AddReservationData,
  ReservationResult,
  ReservationsResult,
} from "./types";
import {
  ValidationError,
  ConflictError,
  NotFoundError,
} from "@/lib/error_handler/customerErrors";
import { throwAppropriateError } from "@/lib/error_handler/throwError";
import { updateClientCheckInStatistics } from "@/app/api/main/statistics/statistics";

export async function addReservation(
  data: AddReservationData,
  hotelId: string,
  employeeId: string
 ): Promise<ReservationResult> {
  try {
    return await prisma.$transaction(async (prisma) => {
      const [room, client] = await Promise.all([
        prisma.room.findFirst({
          where: {
            hotelId,
            number: data.roomNumber,
            type: data.roomType,
            status: RoomStatus.disponible
          },
          
        }),
        prisma.client.findUnique({
          where: { id: data.clientId },
          select: {
            id: true,
            gender: true,
            dateOfBirth: true,
            clientOrigin: true
          }
        })
      ]);
 
      if (!room) throw new NotFoundError("Chambre non trouvée ou déjà réservée ou elle est en panne ou hors service");
      if (!client) throw new NotFoundError("Client non trouvé");
 
      const totalPrice = data.totalDays * room.price.toNumber();
 
      const reservationData = {
        ...data,
        totalPrice,
        unitPrice: room.price.toNumber(),
        hotelId,
        employeeId,
        roomId: room.id,
        clientId: client.id
      };
 
      const newReservation = await (data.state === ReservationState.en_attente ?
        prisma.pendingReservation.create({
          data: reservationData
        }) :
        prisma.reservation.create({
          data: reservationData,
          select: {
            id: true,
            startDate: true, 
            endDate: true,
            unitPrice: true,
            totalDays: true,
            totalPrice: true,
            currentOccupancy: true,
            discoveryChannel: true,
            roomNumber: true,
            roomType: true,
            source: true,
            state: true
          }
        })
      );
 
      await prisma.room.update({
        where: { id: room.id },
        data: { 
          status: data.state === ReservationState.valide ? 
            RoomStatus.reservee : 
            RoomStatus.en_attente 
        }
      });
 
      if (data.state === ReservationState.valide) {
        await updateClientCheckInStatistics(
          hotelId,
          null,
          client.gender,
          client.dateOfBirth,
          null, 
          client.clientOrigin,
          totalPrice,
          prisma,
          true
        );
      }
 
      return { reservation: newReservation };
    });
  } catch (error) {
    throw throwAppropriateError(error);
  }
 }


export async function getAllReservations(
  hotelId: string
): Promise<ReservationsResult> {
  try {
    const reservations = await prisma.reservation.findMany({
      where: { hotelId: hotelId },
      select : {
        id : true,
        startDate : true,
        endDate : true,
        unitPrice : true,
         totalDays : true,
         totalPrice : true,
         currentOccupancy : true,
         discoveryChannel : true,
         roomNumber : true,
         roomType : true,
         source : true,
         state : true , 
         
    }
    });

    return { reservations };
  } catch (error) {
    throw throwAppropriateError(error);
  }
}

export function checkReceptionistAdminRole(roles: UserRole[]) {
  if (
    !roles.includes(UserRole.receptionist) &&
    !roles.includes(UserRole.reception_Manager) &&
    !roles.includes(UserRole.admin)
  ) {
    throw new ValidationError(
      "Sauf le réceptiontist, le réceptionist manager et l'administrateur peut faire cette action"
    );
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
