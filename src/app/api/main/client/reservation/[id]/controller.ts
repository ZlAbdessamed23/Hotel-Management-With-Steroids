import { ReservationResult } from "./types";
import {
  NotFoundError,
  SubscriptionError,
  ValidationError,
} from "@/lib/error_handler/customerErrors";
import { throwAppropriateError } from "@/lib/error_handler/throwError";
import { RoomStatus, UserRole } from "@prisma/client";
import prisma from "@/lib/prisma/prismaClient";
import { addClientsHistorique } from "@/app/api/main/historique/createHistorique";
import { AddClientsHistoriqueData } from "@/app/api/main/historique/types";

export async function deleteReservation(
  reservationId: string | undefined,
  hotelId: string
): Promise<ReservationResult> {
  try {
    

    return await prisma.$transaction(async (prisma) => {
      // Run all initial queries in parallel
      const [reservationWithCount, hotel, houseKeepingPlanificationCount] = await Promise.all([
        prisma.reservation.findFirst({
          where: {
            id: reservationId,
            hotelId,
          },
          include: {
            client: {
              include: {
                reservations: {
                  select: {
                    id: true,
                  },
                  where: {
                    id: {
                      not: reservationId,
                    },
                  },
                },
                pendingReservation: {
                  select: { id: true }
                }
              },
            },
          },
        }),
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
        prisma.houseKeepingPlanification.count({
          where: { hotelId },
        })
      ]);

      if (!reservationWithCount || !reservationWithCount.client) {
        throw new NotFoundError("Réservation ou client non trouvé");
      }

      if (!hotel?.subscription?.plan) {
        throw new SubscriptionError("Hotel n'a pas d'abonnement actif");
      }

      const maxHouseKeepingPlanifications = hotel.subscription.plan.maxHouseKeepingPlanifications;
      
      // Delete reservation, update room status, create client history and housekeeping planification in parallel
      const [deletedReservation, updatedRoom, clientHistorique, houseKeepingPlanification] = await Promise.all([
        prisma.reservation.delete({
          where: { id: reservationId },
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
            state: true,
          }
        }),
        prisma.room.update({
          where: { id: reservationWithCount.roomId },
          data: { 
            status: (reservationWithCount.client.pendingReservation.length > 0) 
              ? RoomStatus.en_attente 
              : RoomStatus.disponible 
          },
        }),
        // Add client historique
        addClientsHistorique({
          fullName: reservationWithCount.client.fullName,
          phoneNumber: reservationWithCount.client.phoneNumber,
          identityCardNumber: reservationWithCount.client.identityCardNumber,
          nationality: reservationWithCount.client.nationality,
          gender: reservationWithCount.client.gender,
          starDate: reservationWithCount.startDate,
          endDate: reservationWithCount.endDate,
        }, hotelId),
        // Add housekeeping planification if within plan limits
        houseKeepingPlanificationCount < maxHouseKeepingPlanifications
          ? prisma.houseKeepingPlanification.create({
              data: {
                hotelId,
                title: `Nettoyage chambre ${reservationWithCount.roomNumber}`,
                description: `Nettoyage après départ client ${reservationWithCount.client.fullName}`,
                start: reservationWithCount.endDate,
                end: new Date(reservationWithCount.endDate.getTime() + 2 * 60 * 60 * 1000), // 2 hours after end date
              },
              select: {
                id: true,
                description: true,
                end: true,
                title: true,
                start: true,
              }
            })
          : null
      ]);

      // Check if client has other reservations before deleting
      const otherReservations = reservationWithCount.client.reservations;
      if (otherReservations.length === 0) {
        await prisma.client.delete({
          where: { id: reservationWithCount.client.id },
        });
      }

      return { 
        reservation: deletedReservation,
        houseKeepingPlanification: houseKeepingPlanification || undefined
      };
    });
  } catch (error) {
    throw throwAppropriateError(error);
  }
}
export async function getReservationById(
  reservationId: string,
  hotelId: string
): Promise<ReservationResult> {
  try {
    const reservation = await prisma.reservation.findUnique({
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

    if (!reservation) {
      throw new NotFoundError("Réservation non trouvée");
    }
    return { reservation };
  } catch (error) {
    throw throwAppropriateError(error);
  }
}
export function checkReceptionistReceptionManagerRole(roles: UserRole[]) {
  if (!roles.includes(UserRole.receptionist)) {
    throw new ValidationError(
      "Sauf le réceptiontist et le réceptionist manager peut faire cette action"
    );
  }
}
