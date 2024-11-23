import prisma from "@/lib/prisma/prismaClient"; // Adjust the import path as needed
import {
  AddAttendueData,
  AttendueResult,
} from "@/app/api/main/event/attendue/types";
import {
  UnauthorizedError,
  NotFoundError,
} from "@/lib/error_handler/customerErrors"; // Adjust as needed
import { throwAppropriateError } from "@/lib/error_handler/throwError";
import { UserRole } from "@prisma/client";

export async function addAttendue(
  data: AddAttendueData,
  hotelId: string
): Promise<AttendueResult> {
  try {
    return await prisma.$transaction(async (prisma) => {
      // Check if the hotel exists and include its events
      const event = await prisma.event.findUnique({
        where: { id: data.eventId, hotelId },
      });

      if (!event) throw new NotFoundError("évenement non touvée");

      // Create the attendee
      const createdAttendee = await prisma.attendue.create({
        data: { ...data, hotelId },
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

      return { Attendue: createdAttendee };
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
      "Sauf le réceptiontist et le réceptionist manager peut faire cette action"
    );
  }
}
