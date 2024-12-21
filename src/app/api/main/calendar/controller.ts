import prisma from "@/lib/prisma/prismaClient"; // Adjust the import path as needed
import {
  AddCalendarData,
  CalendarResult,
  CalendarsResult,
} from "@/app/api/main/calendar/types";
import {
  UnauthorizedError,
  
} from "@/lib/error_handler/customerErrors"; // Adjust as needed
import { throwAppropriateError } from "@/lib/error_handler/throwError";
import { UserRole } from "@prisma/client";

export async function addCalendar(
  data: AddCalendarData,
  hotelId: string
): Promise<CalendarResult> {
  try {
    return await prisma.$transaction(async (prisma) => {
      

      // Create the calendar
      const createdCalendar = await prisma.calendar.create({
        data: { ...data, hotelId },
        select:{
          id : true,
          end: true,
          description:true,
          start:true,
          title : true,
          createdAt : true
        }
      });

      return { Calendar: createdCalendar };
    });
  } catch (error) {
    throwAppropriateError(error);
  }
}
export async function getCalendars(
  hotelId: string
): Promise<CalendarsResult> {
  try {
    return await prisma.$transaction(async (prisma) => {
      

      const Calendars = await prisma.calendar.findMany({
        where: {
          hotelId,
        },
        select:{
          id : true,
          end: true,
          description:true,
          start:true,
          title : true,
          createdAt : true
        }
      });

      return {
        Calendars,
      };
    });
  } catch (error) {
    throwAppropriateError(error);
  }
}
export function checkAdminReceptionManagerRole(roles: UserRole[]) {
  if (!roles.includes(UserRole.admin)&&!roles.includes(UserRole.reception_Manager)) {
    throw new UnauthorizedError("Sauf l'administrateur et reception manager peut faire cet action");
  }
}
