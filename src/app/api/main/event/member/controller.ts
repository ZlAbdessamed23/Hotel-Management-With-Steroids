import {
  AddEventMemberData,
  EventMemberResult,
} from "@/app/api/main/event/member/types";
import {
  ConflictError,
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
      const [reservation, attendee] = await Promise.all([
        prisma.reservation.findUnique({
          where: { id: data.reservationId },
          include: { 
            room: true,
            attendues: true // Include existing attendees
          },
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

      if (!reservation || !reservation.room) {
        throw new NotFoundError("Réservation ou chambre non touvée");
      }

      if (reservation.currentOccupancy >= reservation.room.capacity) {
        throw new LimitExceededError("Chambre est déja complète");
      }

      if (!attendee) {
        throw new NotFoundError("Attendue non trouvé");
      }

      // Check if attendee is already in this reservation
      const isAlreadyInReservation = reservation.attendues.some(
        (existing) => existing.id === attendee.id
      );

      if (isAlreadyInReservation) {
        throw new ConflictError("Cet attendue est déjà dans cette réservation");
      }

      // Connect attendee to reservation and event
      const updatedAttendee = await prisma.attendue.update({
        where: { id: attendee.id, eventId: data.eventId },
        data: {
          reservation: { connect: { id: data.reservationId } },
        },
        select: {
          fullName: true,
          nationality: true,
          address: true,
          dateOfBirth: true,
          email: true,
          id: true,
          gender: true,
          eventId: true,
          identityCardNumber: true,
          phoneNumber: true,
          type: true,
          reservationSource: true,
        }
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
