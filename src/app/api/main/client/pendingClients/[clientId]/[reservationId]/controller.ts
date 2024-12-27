import { NotFoundError, UnauthorizedError } from "@/lib/error_handler/customerErrors";
import { throwAppropriateError } from "@/lib/error_handler/throwError";
import {  ClientOrigin, ReservationState, UserGender, UserRole } from "@prisma/client";
import { PendingReservationResult, UpdatePendingClient } from "@/app/api/main/client/pendingClients/[clientId]/[reservationId]/types";
import prisma from "@/lib/prisma/prismaClient";
import { updateClientCheckInStatistics } from "@/app/api/main/statistics/statistics";

export async function updateClientAndReservation(
  clientId: string,
  reservationId: string,
  hotelId: string,
  
 
): Promise<UpdatePendingClient> {
  try {
    return await prisma.$transaction(async (prisma) => {
      
      const existingClient = await prisma.client.findUnique({
        where: { id: clientId },
        include: {
          pendingReservation: {
            where: { id: reservationId },
          },
        },
      });

      if (!existingClient || !existingClient.pendingReservation.length) {
        throw new NotFoundError(
          "Client or corresponding pending reservation not found"
        );
      }

      const pendingReservation = existingClient.pendingReservation[0];

      
      const [newReservation, deletedPendingReservation] = await Promise.all([
        prisma.reservation.create({
          data: {
            roomNumber: pendingReservation.roomNumber,
            roomType: pendingReservation.roomType,
            startDate: pendingReservation.startDate,
            endDate: pendingReservation.endDate,
            totalDays: pendingReservation.totalDays,
            totalPrice: pendingReservation.totalPrice,
            unitPrice: pendingReservation.unitPrice,
            state: ReservationState.valide, // Mark as valid
            discoveryChannel: pendingReservation.discoveryChannel,
            source: pendingReservation.source,
            hotelId: pendingReservation.hotelId,
            employeeId: pendingReservation.employeeId,
            roomId: pendingReservation.roomId,
            clientId: existingClient.id,
          },
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
        }),
        prisma.pendingReservation.delete({
          where: { id: pendingReservation.id },
        }),
      ]);

      await updateClientCheckInStatistics(
              hotelId,
              null,
              existingClient.gender as UserGender,
              existingClient.dateOfBirth as Date,
              null,
              existingClient.clientOrigin as ClientOrigin,
              0,
              newReservation.totalPrice ,
              prisma,
              true
            );

      return { updatePendingReservation: newReservation };
    });
  } catch (error) {
    throw throwAppropriateError(error);
  }
}


export async function deletePendingReservation(
  reservationId: string
): Promise<PendingReservationResult> {
  try {
    const deletedReservation = await prisma.pendingReservation.delete({
      where: { id: reservationId },
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

    if (!deletedReservation) {
      throw new NotFoundError("Pending reservation not found");
    }
    return {pendingReservation : deletedReservation}
  } catch (error) {
    throw throwAppropriateError(error);
  }
}
export function checkReceptionistAdminRole(roles: UserRole[]) {
    if (
      !roles.includes(UserRole.receptionist) &&
      !roles.includes(UserRole.admin) &&
      !roles.includes(UserRole.reception_Manager)
    ) {
      throw new UnauthorizedError(
        "Sauf le réceptiontist, le réceptionist manager et l'administrateur peut faire cette action"
      );
    }
  }