import prisma from "@/lib/prisma/prismaClient"; // Adjust the import path as needed
import {
  AddSportsFacilityData,
  SportsFacilityResult,
  SportsFacilitiesResult,
} from "@/app/api/main/sports_facility/types";
import {
  LimitExceededError,
  UnauthorizedError,
  NotFoundError,
  SubscriptionError,
  ValidationError,
} from "@/lib/error_handler/customerErrors"; // Adjust as needed
import { UserRole } from "@prisma/client";
import { throwAppropriateError } from "@/lib/error_handler/throwError";
import { updateSportsFacilityStatistics } from "@/app/api/main/statistics/statistics";
export async function addSportsFacility(
  data: AddSportsFacilityData,
  hotelId: string
): Promise<SportsFacilityResult> {
  try {
    return await prisma.$transaction(async (prisma) => {
      const [hotel, sportsFacilityCount] = await Promise.all([
        prisma.hotel.findUnique({
          where: { id: hotelId },
          include: {
            subscription: {
              include: {
                plan: true,
              },
            },
          },
        }),
        prisma.sportsFacility.count({ where: { hotelId } }),
      ]);

      if (!hotel) throw new NotFoundError("Hotel non trouvé");
      if (!hotel.subscription?.plan)
        throw new SubscriptionError("Hotel n'a pas d'abonnement activé");

      if (sportsFacilityCount >= hotel.subscription.plan.maxSales) {
        throw new LimitExceededError(
          "Le nombre Maximum des salles de sports pour ce plan est déja atteint"
        );
      }
      if (data.capacity > 100) {
        throw new ValidationError("Max capacité est 100");
      }

      // Validate coaches
      if (data.sportsFacilityCoaches && data.sportsFacilityCoaches.length > 0) {
        const coachIds = data.sportsFacilityCoaches.map(coach => coach.employeeId);
        const validCoaches = await prisma.employee.findMany({
          where: {
            id: { in: coachIds },
            hotelId,
            role: { has: UserRole.entraineur },
          },
          select: { id: true },
        });

        if (validCoaches.length !== coachIds.length) {
          throw new ValidationError(
            "Un ou plus des entraineurs n'éxiste pas"
          );
        }
      }

      const createdSportFacility = await prisma.sportsFacility.create({
        data: {
          name: data.name,
          description: data.description,
          capacity: data.capacity,
          price: data.price,
          openingDays: data.openingDays,
          location: data.location,
          type: data.type,
          hotel: { connect: { id: hotelId } },
          sportFacilityCoaches: data.sportsFacilityCoaches
            ? {
                create: data.sportsFacilityCoaches.map((coach) => ({
                  employee: { connect: { id: coach.employeeId } },
                })),
              }
            : undefined,
        },
        select : {
          id : true,
          capacity : true,
          createdAt : true,
          description : true,
          location : true,
           name : true,
           price : true,
           openingDays : true,
           type : true,
           
        }
      });

      await updateSportsFacilityStatistics(hotelId, "add", prisma);
      return { sportsFacility: createdSportFacility };
    });
  } catch (error) {
    throwAppropriateError(error);
  }
}

///////////////////  get all rooms for both receptionist and admin /////////////////////////////
export async function getAllSportsFacility(
  hotelId: string
): Promise<SportsFacilitiesResult> {
  try {
    const sportsFacilities = await prisma.sportsFacility.findMany({
      where: { hotelId: hotelId },
      select : {
        id : true,
        capacity : true,
        createdAt : true,
        description : true,
        location : true,
         name : true,
         price : true,
         openingDays : true,
         type : true,
         
      }
    });

    return { sportsFacilities };
  } catch (error) {
    throwAppropriateError(error);
  }
}

/////////////////////////////// function /////////////////////////////////////////
export function checkReceptionManagerCoachAdminRole(roles: UserRole[]) {
  if (
    !roles.includes(UserRole.reception_Manager) &&
    !roles.includes(UserRole.admin) &&
    !roles.includes(UserRole.entraineur)
  ) {
    throw new UnauthorizedError(
      "Sauf le reception manager, l'entraineur et l'administrateur peut faire cette action"
    );
  }
}

export function checkReceptionManagerCoachRole(roles: UserRole[]) {
  if (
    !roles.includes(UserRole.reception_Manager) &&
    !roles.includes(UserRole.entraineur)
  ) {
    throw new UnauthorizedError(
      "Sauf le reception manager et l'entraineur peut faire cette action"
    );
  }
}
