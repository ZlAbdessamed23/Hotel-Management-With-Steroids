import {
  AddEventMemberData,
  EventMemberResult,
} from "@/app/api/main/event/member/types";
import {
  LimitExceededError,
  NotFoundError,
  UnauthorizedError,
} from "@/lib/error_handler/customerErrors";
import { throwAppropriateError } from "@/lib/error_handler/throwError";

import prisma from "@/lib/prisma/prismaClient";
import { UserRole } from "@prisma/client";

export async function addEventMember(
  data: AddEventMemberData,
  hotelId: string
): Promise<EventMemberResult> {
  try {
    return await prisma.$transaction(async (prisma) => {
      const [event, reservation, attendee] = await Promise.all([
        prisma.event.findUnique({
          where: { id: data.eventId, hotelId: hotelId },
        }),
        prisma.reservation.findUnique({
          where: { id: data.reservationId },
          include: { room: true },
        }),
        prisma.attendue.findFirst({
          where: {
            OR: [
              { identityCardNumber: data.identityCardNumber },
              { email: data.email },
              { phoneNumber: data.phoneNumber },
            ],
          },
        }),
      ]);

      if (!event) {
        throw new NotFoundError("évenement non trouvé");
      }

      if (!reservation || !reservation.room) {
        throw new NotFoundError("Réservation ou chambre non touvée");
      }

      if (reservation.currentOccupancy >= reservation.room.capacity) {
        throw new LimitExceededError("Chambre est déja complète");
      }

      if (!attendee) {
        throw new NotFoundError("Attendue non trouvé");
      }

      // Connect attendee to reservation and event
      const updatedAttendee = await prisma.attendue.update({
        where: { id: attendee.id, eventId: data.eventId },
        data: {
          reservation: { connect: { id: data.reservationId } },
        },
      });

      // Increment current occupancy of the reservation
      await prisma.reservation.update({
        where: { id: data.reservationId },
        data: { currentOccupancy: { increment: 1 } },
      });

      return { EventMember: updatedAttendee };
    });
  } catch (error) {
    throw throwAppropriateError(error);
  }
}
export function checkReceptionManagerReceptionistAdminRole(roles: UserRole[]) {
  if (
    !roles.includes(UserRole.receptionist) &&
    !roles.includes(UserRole.reception_Manager) &&
    !roles.includes(UserRole.admin)
  ) {
    throw new UnauthorizedError(
      "Sauf le réceptiontist, le réceptionist manager et l'administrateur peut faire cette action"
    );
  }
}

export function checkReceptionManagerReceptionistRole(roles: UserRole[]) {
  if (
    !roles.includes(UserRole.receptionist) &&
    !roles.includes(UserRole.reception_Manager)
  ) {
    throw new UnauthorizedError(
      "Sauf le réceptiontist et le réceptionist manager peut faire cette action"
    );
  }
}
