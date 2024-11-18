import {
  NotFoundError,
  ValidationError,
} from "@/lib/error_handler/customerErrors";
import { throwAppropriateError } from "@/lib/error_handler/throwError";
import prisma from "@/lib/prisma/prismaClient";
import { UserRole, UserGender, Prisma } from "@prisma/client";
import { MemberResult, UpdateMemberData } from "./types";

export async function getMemberById(
  memberId: string,
  hotelId: string
): Promise<MemberResult> {
  try {
    const member = await prisma.member.findFirst({
      where: {
        id: memberId,
        hotelId: hotelId,
      },
    });

    if (!member) {
      throw new NotFoundError("Client non trouvé");
    }

    return { member };
  } catch (error) {
    throw throwAppropriateError(error);
  }
}

export async function deleteMemberById(
  memberId: string,
  hotelId: string
): Promise<MemberResult> {
  try {
    return await prisma.$transaction(async (prisma) => {
      const member = await prisma.member.findFirst({
        where: {
          id: memberId,
          hotelId: hotelId,
        },
        include: { reservation: true },
      });

      if (!member) {
        throw new NotFoundError(
          `Client non trouvé`
        );
      }

      if (member.reservation) {
        await prisma.reservation.update({
          where: { id: member.reservationId },
          data: { currentOccupancy: { decrement: 1 } },
        });
      }

      const deletedMember = await prisma.member.delete({
        where: {
          id: memberId,
          hotelId: hotelId,
        },
      });
      return { member: deletedMember };
    });
  } catch (error) {
    throw throwAppropriateError(error);
  }
}

export async function updateMember(
  memberId: string,
  hotelId: string,
  data: UpdateMemberData
): Promise<MemberResult> {
  try {
    return await prisma.$transaction(async (prisma) => {
      const existingMember = await prisma.member.findFirst({
        where: { id: memberId, hotelId: hotelId },
      });

      if (!existingMember) {
        throw new NotFoundError(
          `Client non trouvé`
        );
      }

      const updateData: Prisma.MemberUpdateInput = {
        fullName: data.fullName,
        dateOfBirth: data.dateOfBirth,
        phoneNumber: data.phoneNumber,
        email: data.email,
        identityCardNumber: data.identityCardNumber,
        address: data.address,
        nationality: data.nationality,
        gender: data.gender as UserGender,
      };

      // Remove undefined fields
      Object.keys(updateData).forEach((key) => {
        if (
          key in updateData &&
          updateData[key as keyof Prisma.MemberUpdateInput] === undefined
        ) {
          delete updateData[key as keyof Prisma.MemberUpdateInput];
        }
      });

      const updatedMember = await prisma.member.update({
        where: { id: memberId },
        data: updateData,
      });

      return { member: updatedMember };
    });
  } catch (error) {
    throw throwAppropriateError(error);
  }
}

export function checkReceptionistAdminRole(roles: UserRole[]) {
  if (
    !roles.includes(UserRole.receptionist) &&
    !roles.includes(UserRole.admin)
  ) {
    throw new ValidationError(
      "Sauf le réceptiontist, le réceptionist manager et l'administrateur peut faire cette action"
    );
  }
}

export function checkReceptionistRole(roles: UserRole[]) {
  if (!roles.includes(UserRole.receptionist)) {
    throw new ValidationError("Sauf le réceptiontist et le réceptionist manager peut faire cette action");
  }
}
