import {
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from "@/lib/error_handler/customerErrors";
import { throwAppropriateError } from "@/lib/error_handler/throwError";
import prisma from "@/lib/prisma/prismaClient";
import { Prisma, UserRole } from "@prisma/client";
import {
  UpdateSportsFacilityMemberData,
  SportsFacilityMemberResult,
} from "@/app/api/main/sports_facility/member/[sportsFacilityId]/[memberId]/types";

export async function getSportsFacilityMemberById(
  sportsFacilityId: string,
  memberId: string,
  hotelId: string
): Promise<SportsFacilityMemberResult> {
  try {
    const member = await prisma.sportsFacilityMember.findFirst({
      where: {
        id: memberId,
        sportsFacilityId: sportsFacilityId,
      },
    });

    if (!member) {
      throw new NotFoundError("Sports facility member with non trouvée");
    }

    return { sportsFacilityMember: member };
  } catch (error) {
    throwAppropriateError(error);
  }
}

export async function deleteSportsFacilityMemberById(
  sportsFacilityId: string,
  memberId: string,
  hotelId: string
): Promise<SportsFacilityMemberResult> {
  try {
    return await prisma.$transaction(async (prisma) => {
      // First check if member exists
      const member = await prisma.sportsFacilityMember.findUnique({
        where: {
          id: memberId,
          sportsFacilityId: sportsFacilityId,
        },
      });

      if (!member) {
        throw new NotFoundError("Sports facility member not found");
      }

      // Then delete the member
      const deletedMember = await prisma.sportsFacilityMember.delete({
        where: {
          id: memberId,
          sportsFacilityId: sportsFacilityId,
        },
      });

      return { sportsFacilityMember: deletedMember };
    });
  } catch (error) {
    throwAppropriateError(error);
  }
}
export async function updateSportsFacilityMember(
  sportsFacilityId: string,
  memberId: string,
  hotelId: string,
  data: UpdateSportsFacilityMemberData
): Promise<SportsFacilityMemberResult> {
  try {
    return await prisma.$transaction(async (prisma) => {
      const updateData: Prisma.SportsFacilityMemberUpdateInput = {
        email: data.email,
        phoneNumber: data.phoneNumber,
        identityCardNumber: data.identityCardNumber,
      };

      // Remove undefined fields
      Object.keys(updateData).forEach((key) => {
        if (
          key in updateData &&
          updateData[key as keyof Prisma.SportsFacilityMemberUpdateInput] ===
            undefined
        ) {
          delete updateData[
            key as keyof Prisma.SportsFacilityMemberUpdateInput
          ];
        }
      });

      const updatedMember = await prisma.sportsFacilityMember.update({
        where: { id: memberId, sportsFacilityId: sportsFacilityId },
        data: updateData,
      });

      return { sportsFacilityMember: updatedMember };
    });
  } catch (error) {
    throw throwAppropriateError(error);
  }
}

export function checkReceptionManagerCoachAdminRole(roles: UserRole[]) {
  if (
    !roles.includes(UserRole.reception_Manager) &&
    !roles.includes(UserRole.admin) &&
    !roles.includes(UserRole.entraineur)
  ) {
    throw new UnauthorizedError(
      "Only reception_manager, admin, and coach can view all sports facility members."
    );
  }
}
export function checkReceptionManagerCoachRole(roles: UserRole[]) {
  if (
    !roles.includes(UserRole.reception_Manager) &&
    !roles.includes(UserRole.entraineur)
  ) {
    throw new UnauthorizedError(
      "Sauf reception manager , entraineur peut faire cette action"
    );
  }
}
