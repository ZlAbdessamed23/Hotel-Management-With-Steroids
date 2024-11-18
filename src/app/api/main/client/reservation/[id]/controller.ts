import { ReservationResult } from "./types";
import {
  NotFoundError,
  ValidationError,
} from "@/lib/error_handler/customerErrors";
import { throwAppropriateError } from "@/lib/error_handler/throwError";
import { RoomStatus, UserRole } from "@prisma/client";
import prisma from "@/lib/prisma/prismaClient";
import { addClientsHistorique } from "../../../historique/createHistorique";
import { AddClientsHistoriqueData } from "../../../historique/types";

export async function deleteReservation(
  reservationId: string | undefined,
  hotelId: string
): Promise<ReservationResult> {
  try {
    if (!reservationId) {
      throw new NotFoundError("ID de réservation requis");
    }

    return await prisma.$transaction(async (prisma) => {
      // Get reservation and count of client's reservations in one query
      const reservationWithCount = await prisma.reservation.findFirst({
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
            },
          },
        },
      });

      if (!reservationWithCount || !reservationWithCount.client) {
        throw new NotFoundError("Réservation ou client non trouvé");
      }

      // Delete reservation and update room status in parallel
      const [deletedReservation] = await Promise.all([
        prisma.reservation.delete({
          where: { id: reservationId },
        }),
        prisma.room.update({
          where: { id: reservationWithCount.roomId },
          data: { status: RoomStatus.disponible },
        }),
      ]);
      ///////////////////// historique ////////////////////////
      const client = reservationWithCount.client;
      const data: AddClientsHistoriqueData = {
        fullName: client.fullName,
        phoneNumber: client.phoneNumber,
        identityCardNumber: client.identityCardNumber,
        nationality: client.nationality,
        gender: client.gender,
        starDate: reservationWithCount.startDate,
        endDate: reservationWithCount.endDate,
      };
      await addClientsHistorique(data, hotelId);

      // Check if client has other reservations before deleting
      const otherReservations = reservationWithCount.client.reservations;
      if (otherReservations.length === 0) {
        await prisma.client.delete({
          where: { id: reservationWithCount.client.id },
        });
      }

      return { reservation: deletedReservation };
    });
  } catch (error) {
    throw throwAppropriateError(error);
  }
}
export function checkReceptionistRole(roles: UserRole[]) {
  if (!roles.includes(UserRole.receptionist)) {
    throw new ValidationError(
      "Sauf le réceptiontist et le réceptionist manager peut faire cette action"
    );
  }
}
