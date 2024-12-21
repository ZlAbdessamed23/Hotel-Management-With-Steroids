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
      // Parallel verification of hotel
      const hotel = await prisma.hotel.findUnique({
        where: { id: hotelId },
        select: {
          subscription: {
            select: {
              plan: {
                select: {
                  maxSales: true,
                },
              },
            },
          },
          _count: { select: { sportsFacility: true } },
        },
      });

      // Verify hotel and subscription
      if (!hotel) throw new NotFoundError("Hotel non trouvé");
      if (!hotel.subscription?.plan)
        throw new SubscriptionError("Hotel n'a pas de plan d'abonnement active");
      if (hotel._count.sportsFacility >= hotel.subscription.plan.maxSales) {
        throw new LimitExceededError(
          "Le nombre Maximum des salles de sports pour ce plan est déja atteint"
        );
      }

      // Filter valid coach assignments
      const validCoachAssignments = data.sportsFacilityCoaches?.filter(
        (coach) => coach.employeeId !== ""
      ) ;

      // Create sports facility
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
          sportFacilityCoaches: {
            create: validCoachAssignments.map((coach) => ({
              employee: { connect: { id: coach.employeeId } },
            })),
          },
        },
        select: {
          id: true,
          capacity: true,
          createdAt: true,
          description: true,
          location: true,
          name: true,
          price: true,
          openingDays: true,
          type: true,
        },
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
  userId: string,
  userRole: UserRole[],
  hotelId: string,
  
): Promise<SportsFacilitiesResult> {
  try {
    const sportsFacilities = await prisma.sportsFacility.findMany({
      where: userRole.includes(UserRole.entraineur) 
        ? {
            hotelId,
            sportFacilityCoaches: {
              some: {
                employeeId: userId
              }
            }
          }
        : { hotelId },
      select: {
        id: true,
        capacity: true,
        createdAt: true,
        description: true,
        location: true,
        name: true,
        price: true,
        openingDays: true,
        type: true,
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


