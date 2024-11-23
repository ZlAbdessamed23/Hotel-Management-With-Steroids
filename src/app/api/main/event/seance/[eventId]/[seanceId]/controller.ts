import {
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from "@/lib/error_handler/customerErrors";
import { throwAppropriateError } from "@/lib/error_handler/throwError";
import { Prisma, UserRole } from "@prisma/client";
import {
  UpdateEventSeanceData,
  EventSeanceResult,
} from "@/app/api/main/event/seance/[eventId]/[seanceId]/types";
import prisma from "@/lib/prisma/prismaClient";

// Get seance
export async function getEventSeanceById(
  eventId: string,
  seanceId: string,
  hotelId: string
): Promise<EventSeanceResult> {
  try {
    const existingSeance = await prisma.eventSeance.findUnique({
      where: { id: seanceId, eventId: eventId },
      select : {
        id : true,
        description : true,
        end : true,
        start : true,
        eventId : true,
        title : true,
        createdAt : true,
      }
    });

    if (!existingSeance ) {
      throw new NotFoundError(
        `séance non trouvée`
      );
    }

    return { EventSeance: existingSeance };
  } catch (error) {
    throw throwAppropriateError(error);
  }
}

// Delete seance
export async function deleteEventSeance(
  eventId: string,
  seanceId: string,
  hotelId: string
): Promise<EventSeanceResult> {
  try {
    return await prisma.$transaction(async (prisma) => {
      
      const deletedSeance = await prisma.eventSeance.delete({
        where: { id: seanceId },
        select : {
          id : true,
          description : true,
          end : true,
          start : true,
          eventId : true,
          title : true,
          createdAt : true,
        }
      });

      return { EventSeance: deletedSeance };
    });
  } catch (error) {
    throw throwAppropriateError(error);
  }
}

// Update seance
export async function updateEventSeance(
  eventId: string,
  seanceId: string,
  hotelId: string,
  data: UpdateEventSeanceData
): Promise<EventSeanceResult> {
  try {
    return await prisma.$transaction(async (prisma) => {
     

      const updateData: Prisma.EventSeanceUpdateInput = {
        title: data.title,
        description: data.description,
        start: data.start,
        end: data.end,
      };

      Object.keys(updateData).forEach((key) => {
        if (
          key in updateData &&
          updateData[key as keyof Prisma.EventSeanceUpdateInput] === undefined
        ) {
          delete updateData[key as keyof Prisma.EventSeanceUpdateInput];
        }
      });

      const updatedSeance = await prisma.eventSeance.update({
        where: { id: seanceId },
        data: updateData,
        select : {
          id : true,
          description : true,
          end : true,
          start : true,
          eventId : true,
          title : true,
          createdAt : true,
        }
      });

      return { EventSeance: updatedSeance };
    });
  } catch (error) {
    throw throwAppropriateError(error);
  }
}

// Role check functions (you may need to adjust these based on your specific requirements)
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
