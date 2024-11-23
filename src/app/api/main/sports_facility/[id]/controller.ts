import {
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from "@/lib/error_handler/customerErrors";
import { throwAppropriateError } from "@/lib/error_handler/throwError";
import { Prisma, UserRole } from "@prisma/client";
import prisma from "@/lib/prisma/prismaClient";
import { SportsFacilityResult, UpdateSportsFacilityData } from "./types";
import { updateSportsFacilityStatistics } from "@/app/api/main/statistics/statistics";
export async function getSportsFacilityById(
  sportsFacilityId: string,

  hotelId: string
): Promise<SportsFacilityResult> {
  try {
    const existingFacility = await prisma.sportsFacility.findUnique({
      where: { id: sportsFacilityId, hotelId: hotelId },
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

    if (!existingFacility ) {
      throw new NotFoundError(
        `Salle de sport non trouvée`
      );
    }

    return { sportsFacility: existingFacility };
  } catch (error) {
    throw throwAppropriateError(error);
  }
}
//////////////////////////////////// delete ////////////////////////////
export async function deleteSportsFacility(
  sportsFacilityId: string,

  hotelId: string
): Promise<SportsFacilityResult> {
  try {
    return await prisma.$transaction(async (prisma) => {
      
      const deletedFacility = await prisma.sportsFacility.delete({
        where: { id: sportsFacilityId, hotelId: hotelId },
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
      await updateSportsFacilityStatistics(hotelId, "remove", prisma);
      return { sportsFacility: deletedFacility };
    });
  } catch (error) {
    throw throwAppropriateError(error);
  }
}
///////////////////// update ///////////////////////////////////////

export async function updateSportsFacility(
  facilityId: string,
  hotelId: string,
  data: UpdateSportsFacilityData
): Promise<SportsFacilityResult> {
  try {
    return await prisma.$transaction(async (prisma) => {
      // Fetch existing sports facility with coaches
      const existingSportsFacility = await prisma.sportsFacility.findUnique({
        where: { id: facilityId, hotelId },
        include: {
          sportFacilityCoaches: {
            select: { employeeId: true },
          },
        },
      });

      if (!existingSportsFacility) {
        throw new NotFoundError(`Salle de sport non trouvée`);
      }

      const updateData: Prisma.SportsFacilityUpdateInput = {
        name: data.name,
        description: data.description,
        capacity: data.capacity,
        price: data.price,
        openingDays: data.openingDays,
        type: data.type,
        location: data.location,
      };

      // Remove undefined fields
      Object.keys(updateData).forEach((key) => {
        if (updateData[key as keyof Prisma.SportsFacilityUpdateInput] === undefined) {
          delete updateData[key as keyof Prisma.SportsFacilityUpdateInput];
        }
      });

      if (updateData.capacity && Number(updateData.capacity) > 100) {
        throw new ValidationError("Max capacité est 100");
      }

      // Handle coaches update
      if (data.sportsFacilityCoaches) {
        const existingCoachIds = new Set(
          existingSportsFacility.sportFacilityCoaches.map((coach) => coach.employeeId)
        );
        const newCoachIds = new Set(
          data.sportsFacilityCoaches.map((coach) => coach.employeeId)
        );

        const coachesToRemove = Array.from(existingCoachIds).filter(
          (id) => !newCoachIds.has(id)
        );
        const coachesToAdd = Array.from(newCoachIds).filter(
          (id) => !existingCoachIds.has(id)
        );

        // Validate new coaches
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
            throw new ValidationError(
              "Un ou plus des entraineurs n'éxiste pas"
            );
          }
        }

        // Update coaches
        updateData.sportFacilityCoaches = {
          deleteMany: {
            employeeId: { in: coachesToRemove },
          },
          create: coachesToAdd.map((employeeId) => ({
            employee: { connect: { id: employeeId } },
          })),
        };
      }

      // Update the facility
      const updatedFacility = await prisma.sportsFacility.update({
        where: { id: facilityId },
        data: updateData,
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

      return { sportsFacility: updatedFacility };
    });
  } catch (error) {
    throw throwAppropriateError(error);
  }
}

///////////////////////////// functions /////////////////////////////
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

export function checkReceptionistManagerCoachRole(roles: UserRole[]) {
  if (
    !roles.includes(UserRole.reception_Manager) &&
    !roles.includes(UserRole.entraineur)
  ) {
    throw new UnauthorizedError(
      "Sauf le reception manager et l'entraineur peut faire cette action"
    );
  }
}
