import { throwAppropriateError } from "@/lib/error_handler/throwError";
import prisma from "@/lib/prisma/prismaClient";
import {
  SportFacilityCoaches,
  SportsFacilityCoachesResult,
  UpdateSportsFacilityCoachesData,
} from "@/app/api/main/sports_facility/coach/[sportsFacilityId]/types";
import { Prisma, UserRole } from "@prisma/client";
import {
  NotFoundError,
  UnauthorizedError,
} from "@/lib/error_handler/customerErrors";

export async function getAllSportsFacilityCoaches(
  sportFacilityId: string,
  hotelId: string
): Promise<SportFacilityCoaches> {
  try {
    return await prisma.$transaction(async (prisma) => { 
      const [sportFacility,SportFacilityCoachesCount] = await Promise.all([prisma.sportsFacility.findUnique({
        where: {
          id: sportFacilityId,
          hotelId: hotelId,
        },
        include: {
          sportFacilityCoaches: {
            include: {
              employee: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true,
                  phoneNumber: true,
                  gender: true,
                  workingDays: true,
                  state: true,
                },
              },
            },
          },
        },
      })
    ,prisma.employee.count({where:{hotelId}})]) 

    if (!sportFacility) {
      throw new Error("Salle de sport non trouvée");
    }

    const coaches = sportFacility.sportFacilityCoaches;
    return { coaches,SportFacilityCoachesCount };})
   
  } catch (error) {
    throwAppropriateError(error);
  }
}

///////////////// update //////////////////////////////
export async function updateSportsFacilityCoaches(
  sportsFacilityId: string,
  hotelId: string,
  data: UpdateSportsFacilityCoachesData
): Promise<SportsFacilityCoachesResult> {
  try {
    return await prisma.$transaction(async (prisma) => {
      // Fetch existing sports facility with coaches in a single query
      const existingSportsFacility = await prisma.sportsFacility.findUnique({
        where: { id: sportsFacilityId, hotelId },
        select: {
          id: true,
          sportFacilityCoaches: {
            select: { employeeId: true },
          },
        },
      });

      if (!existingSportsFacility) {
        throw new NotFoundError(
          `Salle de sport non trouvée`
        );
      }

      const existingCoachIds = new Set(
        existingSportsFacility.sportFacilityCoaches.map(
          (coach) => coach.employeeId
        )
      );
      const newCoachIds = new Set(
        data.sportsFacilityCoaches?.map((coach) => coach.employeeId) || []
      );

      // Early exit if no changes
      if (
        existingCoachIds.size === newCoachIds.size &&
        Array.from(existingCoachIds).every((id) => newCoachIds.has(id))
      ) {
        return {
          SportsFacility: await prisma.sportsFacility.findUnique({
            where: { id: sportsFacilityId },
            include: {
              sportFacilityCoaches: {
                include: { employee: true },
              },
            },
          }),
        };
      }

      // Efficient update operations
      const coachesToRemove = Array.from(existingCoachIds).filter(
        (id) => !newCoachIds.has(id)
      );
      const coachesToAdd = Array.from(newCoachIds).filter(
        (id) => !existingCoachIds.has(id)
      );

      // Validate new coaches in a single query
      if (coachesToAdd.length > 0) {
        const validCoaches = await prisma.employee.findMany({
          where: {
            id: { in: coachesToAdd },
            hotelId,
            role: { has: UserRole.entraineur },
          },
          select: { id: true },
        });

        if (validCoaches.length !== coachesToAdd.length) {
          throw new NotFoundError(
            "Un ou plus des entraineurs n'éxiste pas"
          );
        }
      }

      // Perform updates
      const updatePromises: Promise<{ count: number }>[] = [];

      if (coachesToRemove.length > 0) {
        updatePromises.push(
          prisma.sportsFacilityCoach.deleteMany({
            where: {
              sportFacilityId: sportsFacilityId,
              employeeId: { in: coachesToRemove },
            },
          })
        );
      }

      if (coachesToAdd.length > 0) {
        updatePromises.push(
          prisma.sportsFacilityCoach.createMany({
            data: coachesToAdd.map((employeeId) => ({
              sportFacilityId: sportsFacilityId,
              employeeId,
            })),
          })
        );
      }

      // Execute all updates in parallel
      await Promise.all(updatePromises);

      // Fetch and return updated sports facility
      const updatedSportsFacility = await prisma.sportsFacility.findUnique({
        where: { id: sportsFacilityId },
        include: {
          sportFacilityCoaches: {
            include: {
              employee: true,
            },
          },
        },
      });

      return { SportsFacility: updatedSportsFacility };
    });
  } catch (error) {
    throwAppropriateError(error);
  }
}
export function checkReceptionManagerCoachAdminRole(roles: UserRole[]) {
  if (
    !roles.includes(UserRole.reception_Manager) &&
    !roles.includes(UserRole.entraineur) &&
    !roles.includes(UserRole.admin)
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
