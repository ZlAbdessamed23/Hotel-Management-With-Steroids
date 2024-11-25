import {
  NotFoundError,
  UnauthorizedError,
} from "@/lib/error_handler/customerErrors";
import { throwAppropriateError } from "@/lib/error_handler/throwError";
import { RoomStatus, UserRole } from "@prisma/client";
import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma/prismaClient";
import {
  ReservationUpdateData,
  UpdateReservationResult,
} from "@/app/api/main/event/reservation/[eventId]/[reservationId]/types";

export async function updateReservation(
  data: ReservationUpdateData,
  reservationId: string,
  hotelId: string
): Promise<UpdateReservationResult> {
  try {
    return await prisma.$transaction(async (prisma) => {
      // Find the existing reservation
      const existingReservation = await prisma.reservation.findFirst({
        where: {
          id: reservationId,

          hotel: { id: hotelId },
        },
        include: { room: true },
      });

      if (!existingReservation) {
        throw new NotFoundError(
          `Reservation non trouvée`
        );
      }

      const reservationUpdateData: Prisma.ReservationUpdateInput = {
        startDate: data.startDate,
        endDate: data.endDate,
        totalDays: data.totalDays,
        state: data.status,
        source: data.source,
        discoveryChannel: data.discoveryChannel,
      };

      // Remove undefined fields
      Object.keys(reservationUpdateData).forEach((key) => {
        if (
          reservationUpdateData[key as keyof Prisma.ReservationUpdateInput] ===
          undefined
        ) {
          delete reservationUpdateData[
            key as keyof Prisma.ReservationUpdateInput
          ];
        }
      });

      // Check if room change is requested and if it's different from the current room
      const isRoomChangeRequested =
        data.roomNumber !== undefined || data.roomType !== undefined;
      const isSameRoom =
        (!data.roomNumber ||
          data.roomNumber === existingReservation.room.number) &&
        (!data.roomType || data.roomType === existingReservation.room.type);

      if (isRoomChangeRequested && !isSameRoom) {
        const newRoomType = data.roomType || existingReservation.room.type;
        const newRoomNumber =
          data.roomNumber || existingReservation.room.number;

        const newRoom = await prisma.room.findFirst({
          where: {
            hotelId,
            number: newRoomNumber,
            type: newRoomType,
            status: RoomStatus.disponible,
          },
        });

        if (!newRoom) {
          throw new NotFoundError(
            `Chambre non trouvée`
          );
        }

        // Update old room status
        await prisma.room.update({
          where: { id: existingReservation.roomId },
          data: { status: RoomStatus.disponible },
        });

        // Update new room status
        await prisma.room.update({
          where: { id: newRoom.id },
          data: { status: RoomStatus.reservee },
        });

        reservationUpdateData.roomNumber = newRoomNumber;
        reservationUpdateData.roomType = newRoomType;
        reservationUpdateData.room = { connect: { id: newRoom.id } };
      }

      // Update reservation
      const updatedReservation = await prisma.reservation.update({
        where: { id: reservationId },
        data: reservationUpdateData,
        include: { room: true, client: true },
      });

      return { reservation: updatedReservation };
    });
  } catch (error) {
    throwAppropriateError(error);
  }
}
export function checkReceptionManagerReceptionistRole(roles: UserRole[]) {
  if (
    !roles.includes(UserRole.receptionist) &&
    !roles.includes(UserRole.reception_Manager)
  ) {
    throw new UnauthorizedError(
      "Sauf le receptionist et le receptionist manager peut faire cette action"
    );
  }
}
