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
      // Parallel fetch of sports facility (with count) and client
      const [existingSportsFacility, client] = await Promise.all([
        prisma.sportsFacility.findUnique({
          where: { id: data.sportsFacilityId },
          include: {
            _count: {
              select: {
                member: true,
              },
            },
          },
        }),
        prisma.client.findFirst({
          where: {
            OR: [
              { identityCardNumber: data.identityCardNumber },
              { email: data.email },
              { phoneNumber: data.phoneNumber },
            ],
          },
        }),
      ]);

      // Check if the sports facility exists
      if (!existingSportsFacility) {
        throw new NotFoundError(
          `Sports facility non trouvée`
        );
      }

      // Check if client exists
      if (!client) {
        throw new NotFoundError("Client not found");
      }

      // Check if the sports facility has capacity
      // Now using the _count from the initial query
      if (existingSportsFacility.capacity <= existingSportsFacility._count.member) {
        throw new LimitExceededError(
          `Le nombre Maximum des membre pour ce sport facility est déja attein`
        );
      }

      // Create the sports facility member
      const sportsFacilityMember = await prisma.sportsFacilityMember.create({
        data: {
          email: data.email,
          phoneNumber: data.phoneNumber,
          identityCardNumber: data.identityCardNumber,
          clientName: client.fullName,
          gender: client.gender,
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
        select:{
          id : true,
    email : true,
    phoneNumber : true,
    clientName:true,
    gender:true,
    identityCardNumber : true,
        }
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
      "Sauf le reception manager, l'entraineur peut faire cette action"
    );
  }
}
