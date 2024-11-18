import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma/prismaClient"; // Adjust the import path as needed
import {
  AddSportsFacilityMemberData,
  SportsFacilityMemberResult,
} from "@/app/api/main/sports_facility/member/types";
import {
  
  NotFoundError,
  LimitExceededError,
  UnauthorizedError,
} from "@/lib/error_handler/customerErrors"; // Adjust as needed
import { UserRole } from "@prisma/client";
import { throwAppropriateError } from "@/lib/error_handler/throwError";

export async function addSportsFacilityMember(
  data: AddSportsFacilityMemberData,
  
): Promise<SportsFacilityMemberResult> {
  try {
    return await prisma.$transaction(async (prisma) => {
      // Check if the sports facility exists
      const existingSportsFacility = await prisma.sportsFacility.findUnique({
        where: { id: data.sportsFacilityId },
      });

      if (!existingSportsFacility) {
        throw new NotFoundError(
          `Sports facility non trouvée`
        );
      }

      // Check if the sports facility has capacity
      const sportsFacilityMembers: number =
        await prisma.sportsFacilityMember.count({
          where: { sportsFacilityId: data.sportsFacilityId },
        });
      if (existingSportsFacility.capacity <= sportsFacilityMembers) {
        throw new LimitExceededError(
          `Le nombre Maximum des membre pour ce sport facility est déja attein`
        );
      }

      // Check if the client exists based on the provided information
      let client = await prisma.client.findFirst({
        where: {
          OR: [
            { identityCardNumber: data.identityCardNumber },
            { email: data.email },
            { phoneNumber: data.phoneNumber },
          ],
        },
      });

      if (!client) {
        throw new NotFoundError("Client not found");
      }

      // Create the sports facility member
      const sportsFacilityMember = await prisma.sportsFacilityMember.create({
        data: {
          email: data.email,
          phoneNumber: data.phoneNumber,
          identityCardNumber: data.identityCardNumber,
          clientName: client.fullName,
          gender : client.gender,
          client: {
            connect: {
              id: client.id,
            },
          },
          sportsFacility: {
            connect: {
              id: data.sportsFacilityId,
            },
          },
        },
      });

      return { sportsFacilityMember };
    });
  } catch (error) {
    throw throwAppropriateError(error);
  }
}


/////////////////////////// functions ////////////////////////////////////

export function checkReceptionistManagerCoachRole(roles: UserRole[]) {
  if (
    !roles.includes(UserRole.reception_Manager) &&
    !roles.includes(UserRole.entraineur)
  ) {
    throw new UnauthorizedError(
      "Only reception_manager_coach can add sports facility"
    );
  }
}
