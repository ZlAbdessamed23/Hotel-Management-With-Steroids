import prisma from "@/lib/prisma/prismaClient"; // Adjust the import path as needed
import { EventEventSeancesResult } from "@/app/api/main/event/seance/[eventId]/types"; // Adjust the import path as needed

import { throwAppropriateError } from "@/lib/error_handler/throwError";
import { UserRole } from "@prisma/client";
import {
  NotFoundError,
  UnauthorizedError,
} from "@/lib/error_handler/customerErrors";

export async function getEventSeances(
  eventId: string,
  hotelId: string
): Promise<EventEventSeancesResult> {
  try {
    return await prisma.$transaction(async (prisma) => {
      // First, check if the event exists
      const eventExists = await prisma.event.findUnique({
        where: {
          id: eventId,
          hotelId: hotelId,
        },
      });

      if (!eventExists) {
        throw new NotFoundError(
          "évenement non trouvé"
        );
      }

      // If the event exists, find all attendees
      const EventSeances = await prisma.eventSeance.findMany({
        where: {
          eventId: eventId,
        },
      });

      return {
        EventSeances,
      };
    });
  } catch (error) {
    throwAppropriateError(error);
  }
}
export function checkReceptionManagerReceptionistAdminRole(roles: UserRole[]) {
  if (
    !roles.includes(UserRole.admin) &&
    !roles.includes(UserRole.reception_Manager) &&
    !roles.includes(UserRole.receptionist)
  ) {
    throw new UnauthorizedError(
      "Sauf le réceptiontist, le réceptionist manager et l'administrateur peut faire cette action"
    );
  }
}
