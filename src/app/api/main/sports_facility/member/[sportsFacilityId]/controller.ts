import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma/prismaClient"; // Adjust the import path as needed
import { SportsFacilitiesResult } from "@/app/api/main/sports_facility/member/[sportsFacilityId]/types";
import {
  UnauthorizedError,
  NotFoundError,
} from "@/lib/error_handler/customerErrors"; // Adjust as needed
import { UserRole } from "@prisma/client";
import { throwAppropriateError } from "@/lib/error_handler/throwError";

export async function getAllSportsFacilityMembers(
  hotelId: string,
  sportsFacilityId: string
): Promise<SportsFacilitiesResult> {
  try {
    return await prisma.$transaction(async (prisma) => {
      const sportsFacilityMembers = await prisma.sportsFacilityMember.findMany({
        where: {
          sportsFacilityId: sportsFacilityId,
        },
        select :{
          id : true,
          email : true,
          phoneNumber : true,
          clientName:true,
          gender:true,
          identityCardNumber : true,
      
        }
        
      });

      return { sportsFacilitiesMember: sportsFacilityMembers };
    });
  } catch (error) {
    throw throwAppropriateError(error);
  }
}

/////////////////////////// functions /////////////////////////////////

export function checkReceptionManagerCoachAdminRole(roles: UserRole[]) {
  if (
    !roles.includes(UserRole.reception_Manager) &&
    !roles.includes(UserRole.admin) &&
    !roles.includes(UserRole.entraineur)
  ) {
    throw new UnauthorizedError(
      "Sauf administrateur , reception manager , entraineur peut faire cette action"
    );
  }
}
