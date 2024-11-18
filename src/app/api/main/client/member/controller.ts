import { Member, Room, Reservation, UserRole, Prisma } from "@prisma/client";
import prisma from "@/lib/prisma/prismaClient";
import { AddMemberData, MemberResult, MembersResult } from "./types";
import {
  ValidationError,
  ConflictError,
  LimitExceededError,
  NotFoundError,
} from "@/lib/error_handler/customerErrors";
import { throwAppropriateError } from "@/lib/error_handler/throwError";

export async function addMember(
  data: AddMemberData,
  hotelId: string,
  employeeId: string
): Promise<MemberResult> {
  try {
    return await prisma.$transaction(async (prisma) => {
      const reservation = await prisma.reservation.findUnique({
        where: { id: data.reservationId },
        include: { room: true },
      });

      if (!reservation || !reservation.room) {
        throw new NotFoundError("Réservation ou chambre non touvée");
      }

      if (reservation.currentOccupancy >= reservation.room.capacity) {
        throw new LimitExceededError("la chambre est déja complète");
      }

      const newMember = await prisma.member.create({
        data: {
          ...data,
          hotelId,
          employeeId,
        },
      });

      await prisma.reservation.update({
        where: { id: data.reservationId },
        data: { currentOccupancy: { increment: 1 } },
      });

      return { member: newMember };
    });
  } catch (error) {
    throw throwAppropriateError(error);
  }
}

export async function getAllMembers(hotelId: string): Promise<MembersResult> {
  try {
    const members = await prisma.member.findMany({
      where: { hotelId: hotelId },
    });

    return { members };
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
