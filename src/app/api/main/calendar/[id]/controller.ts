import {
  NotFoundError,
  UnauthorizedError,
} from "@/lib/error_handler/customerErrors";
import { throwAppropriateError } from "@/lib/error_handler/throwError";
import { Prisma, UserRole } from "@prisma/client";
import {
  UpdateCalendarData,
  CalendarResult,
} from "@/app/api/main/calendar/[id]/types";
import prisma from "@/lib/prisma/prismaClient";

// Get seance
export async function getCalendarById(
  id: string,
  hotelId: string
): Promise<CalendarResult> {
  try {
    const existingCalendar = await prisma.calendar.findUnique({
      where: { id: id, hotelId },select:{
        id : true,
        end: true,
        description:true,
        start:true,
        title : true,
        createdAt : true
      }
    });

    if (!existingCalendar ) {
      throw new NotFoundError(
        `Calendrier non trouvé`
      );
    }

    return { Calendar: existingCalendar };
  } catch (error) {
    throw throwAppropriateError(error);
  }
}

// Delete Calendar
export async function deleteCalendar(
  id: string,
  hotelId: string
): Promise<CalendarResult> {
  try {
    return await prisma.$transaction(async (prisma) => {
     

      const deletedSeance = await prisma.calendar.delete({
        where: { id },
        select:{
          id : true,
          end: true,
          description:true,
          start:true,
          title : true,
          createdAt : true
        }
      });

      return { Calendar: deletedSeance };
    });
  } catch (error) {
    throw throwAppropriateError(error);
  }
}

// Update seance
export async function updateCalendar(
  id: string,
  hotelId: string,
  data: UpdateCalendarData
): Promise<CalendarResult> {
  try {
    return await prisma.$transaction(async (prisma) => {
     
      const updateData: Prisma.CalendarUpdateInput = {
        title: data.title,
        description: data.description,
        start: data.start,
        end: data.end,
      };

      Object.keys(updateData).forEach((key) => {
        if (
          key in updateData &&
          updateData[key as keyof Prisma.CalendarUpdateInput] === undefined
        ) {
          delete updateData[key as keyof Prisma.CalendarUpdateInput];
        }
      });

      const updatedSeance = await prisma.calendar.update({
        where: { id: id },
        data: updateData,
        select:{
          id : true,
          end: true,
          description:true,
          start:true,
          title : true,
          createdAt : true
        }
      });

      return { Calendar: updatedSeance };
    });
  } catch (error) {
    throw throwAppropriateError(error);
  }
}

// Role check functions (you may need to adjust these based on your specific requirements)
export function checkAdminRole(roles: UserRole[]) {
  if (!roles.includes(UserRole.admin)) {
    throw new UnauthorizedError("Sauf l'administrateur peut faire cet action");
  }
}
