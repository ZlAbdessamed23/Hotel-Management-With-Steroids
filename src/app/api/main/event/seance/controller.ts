import prisma from "@/lib/prisma/prismaClient"; // Adjust the import path as needed
import {
  AddEventSeanceData,
  EventSeanceResult,
} from "@/app/api/main/event/seance/types";
import {
  UnauthorizedError,
  NotFoundError,
} from "@/lib/error_handler/customerErrors"; // Adjust as needed
import { throwAppropriateError } from "@/lib/error_handler/throwError";
import { UserRole } from "@prisma/client";

export async function addEventSeance(
  data: AddEventSeanceData,
  hotelId: string
): Promise<EventSeanceResult> {
  try {
    return await prisma.$transaction(async (prisma) => {
      // Check if the hotel exists and include its events
      const event = await prisma.event.findUnique({
        where: { id: data.eventId, hotelId },
      });

      if (!event) throw new NotFoundError("évenement non trouvé");

      // Create the attendee
      const createdEventSeance = await prisma.eventSeance.create({
        data: { ...data },
      });

      return { EventSeance: createdEventSeance };
    });
  } catch (error) {
    throwAppropriateError(error);
  }
}

export function checkReceptionManagerReceptionistRole(roles: UserRole[]) {
  if (
    !roles.includes(UserRole.reception_Manager) &&
    !roles.includes(UserRole.receptionist)
  ) {
    throw new UnauthorizedError(
      "Sauf receptionist,reception manager peut faire cette action"
    );
  }
}
