import prisma from "@/lib/prisma/prismaClient";
import {
  NotFoundError,
  ValidationError,
  ConflictError,
} from "@/lib/error_handler/customerErrors";
import { throwAppropriateError } from "@/lib/error_handler/throwError";
import {
  UserRole,
  ReservationState,
  ReservationSource,
  RoomStatus,
  Prisma,
} from "@prisma/client";
import {
  CreateReservationWithAttendeeData,
  ReservationWithAttendeeResult,
} from "@/app/api/main/event/reservation/types";

// Controller functions
export async function createReservationWithAttendee(
  data: CreateReservationWithAttendeeData,
  employeeId: string,
  hotelId: string
): Promise<ReservationWithAttendeeResult> {
  try {
    return await prisma.$transaction(async (prisma) => {
      const [room, attendee, event] = await Promise.all([
        prisma.room.findFirst({
          where: {
            hotelId: hotelId,
            number: data.roomNumber,
            type: data.roomType,
          },
        }),
        prisma.attendue.findFirst({
          where: { id: data.attendueId, eventId: data.eventId },
        }),
        prisma.event.findFirst({
          where: { id: data.eventId, hotelId: hotelId },
        }),
      ]);

      if (!room) {
        throw new NotFoundError("Chambre non trouvée");
      }
      if (room.status === RoomStatus.reservee) {
        throw new ConflictError("la chambre est déja réservée");
      }

      if (!attendee) {
        throw new NotFoundError("Membre non touvé");
      }

      if (!event) {
        throw new NotFoundError("Evenement non trouvé");
      }

      const unitPrice = room.price.toNumber();
      const totalPrice = data.totalDays * unitPrice;

      const createdReservation = await prisma.reservation.create({
        data: {
          roomNumber: data.roomNumber,
          roomType: data.roomType,
          startDate: data.startDate,
          endDate: data.endDate,
          totalDays: data.totalDays,
          totalPrice,
          unitPrice, // Added the required unitPrice field
          state: data.state || ReservationState.en_attente,
          source: data.source || ReservationSource.seul,
          currentOccupancy: data.currentOccupancy || 1,
          discoveryChannel: data.discoveryChannel,
          hotel: { connect: { id: hotelId } },
          employee: { connect: { id: employeeId } },
          room: { connect: { id: room.id } },
          attendues: { connect: { id: data.attendueId } },
        },
        include: {
          attendues: true,
        },
      });

      await prisma.room.update({
        where: { id: room.id },
        data: { status: RoomStatus.reservee },
      });

      return {
        reservation: createdReservation,
      };
    });
  } catch (error) {
    throw throwAppropriateError(error);
  }
}

// Role check functions remain the same
export function checkReceptionManagerReceptionistAdminRole(roles: UserRole[]) {
  if (
    !roles.includes(UserRole.receptionist) &&
    !roles.includes(UserRole.reception_Manager) &&
    !roles.includes(UserRole.admin)
  ) {
    throw new ValidationError(
      "Sauf le receptionist , le receptionist manager et l'Administrateur peut faire cette action"
    );
  }
}

export function checkReceptionManagerReceptionistRole(roles: UserRole[]) {
  if (
    !roles.includes(UserRole.receptionist) &&
    !roles.includes(UserRole.reception_Manager)
  ) {
    throw new ValidationError(
      "Sauf le receptionist et le receptionist manager peut faire cette action"
    );
  }
}