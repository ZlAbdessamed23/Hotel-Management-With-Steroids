import {
  NotFoundError,
  UnauthorizedError,
} from "@/lib/error_handler/customerErrors";
import { throwAppropriateError } from "@/lib/error_handler/throwError";
import { Prisma, RoomStatus, UserRole } from "@prisma/client";
import prisma from "@/lib/prisma/prismaClient";
import {
  EventResult,
  UpdateEventData,
} from "@/app/api/main/event/event/[id]/types";
import { updateEventStatistics } from "@/app/api/main/statistics/statistics";

export async function getEventById(
  eventId: string,
  hotelId: string
): Promise<EventResult> {
  try {
    const existingEvent = await prisma.event.findUnique({
      where: { id: eventId, hotelId: hotelId },
      select : {
        bankCard : true,
        createdAt : true,
        name : true,
        description : true,
        guests : true,
        leader : true,
        id : true,
        startDate : true,
        endDate : true , 
        eventType : true,
        
      }
    });

    if (!existingEvent ) {
      throw new NotFoundError(
        `évenement non trouvé`
      );
    }

    return { Event: existingEvent };
  } catch (error) {
    throw throwAppropriateError(error);
  }
}

export async function deleteEvent(
  eventId: string,
  hotelId: string
): Promise<EventResult> {
  try {
    return await prisma.$transaction(async (prisma) => {
      // First get all attendues with their reservations and rooms
      const eventWithAttendues = await prisma.event.findUnique({
        where: { id: eventId, hotelId: hotelId },
        include: {
          attendue: {
            include: {
              reservation: {
                select: {
                  id: true,
                  room: {
                    select: {
                      id: true
                    }
                  }
                }
              }
            }
          }
        }
      });

      if (!eventWithAttendues) {
        throw new NotFoundError("Événement non trouvé");
      }

      // Get unique reservations and rooms
      const reservationsToDelete = new Set<string>();
      const roomsToUpdate = new Set<string>();

      // Collect reservation and room IDs
      eventWithAttendues.attendue.forEach(attendue => {
        if (attendue.reservation) {
          reservationsToDelete.add(attendue.reservation.id);
          if (attendue.reservation.room) {
            roomsToUpdate.add(attendue.reservation.room.id);
          }
        }
      });

      // Delete reservations and update rooms in parallel
      if (reservationsToDelete.size > 0) {
        await Promise.all([
          // Delete all identified reservations
          prisma.reservation.deleteMany({
            where: {
              id: {
                in: Array.from(reservationsToDelete)
              }
            }
          }),
          // Update all identified rooms
          prisma.room.updateMany({
            where: {
              id: {
                in: Array.from(roomsToUpdate)
              }
            },
            data: {
              status: RoomStatus.disponible
            }
          })
        ]);
      }

      // Delete the event (this will cascade delete attendues)
      const deletedEvent = await prisma.event.delete({
        where: { id: eventId, hotelId: hotelId },
        select: {
          bankCard: true,
          createdAt: true,
          name: true,
          description: true,
          guests: true,
          leader: true,
          id: true,
          startDate: true,
          endDate: true,
          eventType: true,
        }
      });

      return { Event: deletedEvent };
    });
  } catch (error) {
    throw throwAppropriateError(error);
  }
}

export async function updateEvent(
  eventId: string,
  hotelId: string,
  data: UpdateEventData
): Promise<EventResult> {
  try {
    return await prisma.$transaction(async (prisma) => {
      

      const updateData: Prisma.EventUpdateInput = {
        name: data.name,
        description: data.description,
        eventType: data.eventType,
      };

      Object.keys(updateData).forEach((key) => {
        if (
          key in updateData &&
          updateData[key as keyof Prisma.EventUpdateInput] === undefined
        ) {
          delete updateData[key as keyof Prisma.EventUpdateInput];
        }
      });

      const updatedEvent = await prisma.event.update({
        where: { id: eventId },
        data: updateData,
        select : {
          bankCard : true,
          createdAt : true,
          name : true,
          description : true,
          guests : true,
          leader : true,
          id : true,
          startDate : true,
          endDate : true , 
          eventType : true,
          
        }
      });

      return { Event: updatedEvent };
    });
  } catch (error) {
    throw throwAppropriateError(error);
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
