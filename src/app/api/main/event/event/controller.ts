import prisma from "@/lib/prisma/prismaClient"; // Adjust the import path as needed
import { AddEventData, EventResult, EventsResult } from "@/app/api/main/event/event/types";
import {
  LimitExceededError,
  UnauthorizedError,
  NotFoundError,
  SubscriptionError,
} from "@/lib/error_handler/customerErrors"; // Adjust as needed
import { UserRole } from "@prisma/client";
import { throwAppropriateError } from "@/lib/error_handler/throwError";
import { updateEventStatistics } from "@/app/api/main/statistics/statistics";

export async function addEvent(
  data: AddEventData,
  hotelId: string
): Promise<EventResult> {
  try {
    return await prisma.$transaction(async (prisma) => {
      const hotel = await prisma.hotel.findUnique({
        where: { id: hotelId },
        include: {
          subscription: {
            include: {
              plan: true,
            },
          },
          _count: {
            select: {
              event: true,
            },
          },
        },
      });

      if (!hotel) throw new NotFoundError("hotel non trouvé");
      if (!hotel.subscription?.plan)
        throw new SubscriptionError("Hotel n'a pas d'abonnement actif");

      const eventCount = hotel._count.event;

      if (eventCount >= hotel.subscription.plan.maxEvents) {
        throw new LimitExceededError(
          "Le nombre Maximum des évennements pour ce plan est déja atteint"
        );
      }

      const createdEvent = await prisma.event.create({
        data: { ...data, hotelId },
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
     await updateEventStatistics(hotelId,"add",prisma)
      return { Event: createdEvent };
    });
  } catch (error) {
    throwAppropriateError(error);
  }
}

export async function getAllEvents(hotelId: string): Promise<EventsResult> {
  try {
    const events = await prisma.event.findMany({
      where: { hotelId: hotelId },
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

    return { Events: events };
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
