import prisma from "@/lib/prisma/prismaClient"; // Adjust the import path as needed
import { EventAttendeeResult } from "@/app/api/main/event/attendue/[eventId]/types"; // Adjust the import path as needed

import { throwAppropriateError } from "@/lib/error_handler/throwError";
import { UserRole } from "@prisma/client";
import {
  NotFoundError,
  UnauthorizedError,
} from "@/lib/error_handler/customerErrors";

export async function getEventAttendees(
  eventId: string,
  hotelId: string
): Promise<EventAttendeeResult> {
  try {
    return await prisma.$transaction(async (prisma) => {
     

      // If the event exists, find all attendees
      const Attendues = await prisma.attendue.findMany({
        where: {
          eventId: eventId,
          hotelId: hotelId,
        },
        select : {
          address : true,
          email : true,
          phoneNumber : true,
          id : true,
          identityCardNumber : true,
          type : true,
          dateOfBirth : true,
          gender : true,
          fullName : true,
          eventId : true,
          reservationId : true,
          reservationSource : true,
          nationality : true,
      
        }
      });

      return {
        Attendues,
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
      "Sauf le réceptiontist , le réceptionist manager et l'administrateur peut faire cette action"
    );
  }
}
