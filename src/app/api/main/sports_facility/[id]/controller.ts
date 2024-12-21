import {
  NotFoundError,
  UnauthorizedError,
 
} from "@/lib/error_handler/customerErrors";
import { throwAppropriateError } from "@/lib/error_handler/throwError";
import { Prisma, UserRole } from "@prisma/client";
import prisma from "@/lib/prisma/prismaClient";
import { SportsFacilityResult, UpdateSportsFacilityData } from "@/app/api/main/sports_facility/[id]/types";
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
    const updateData: Prisma.SportsFacilityUpdateInput = {};

    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.capacity !== undefined) updateData.capacity = data.capacity;
    if (data.price !== undefined) updateData.price = data.price;
    if (data.openingDays !== undefined) updateData.openingDays = data.openingDays;
    if (data.type !== undefined) updateData.type = data.type;
    if (data.location !== undefined) updateData.location = data.location;

    if (Array.isArray(data.sportsFacilityCoaches)) {
      const newCoachIds = data.sportsFacilityCoaches
        .filter(coach => coach.employeeId !== "") // Filter out empty coach IDs
        .map(coach => coach.employeeId);

      updateData.sportFacilityCoaches = {
        deleteMany: {
          sportFacilityId: facilityId,
        },
        ...(newCoachIds.length > 0 && {
          create: newCoachIds.map((employeeId) => ({
            employee: { connect: { id: employeeId } },
          })),
        }),
      };
    }

    const updatedFacility = await prisma.sportsFacility.update({
      where: { id: facilityId },
      data: updateData,
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

    return { sportsFacility: updatedFacility };
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


