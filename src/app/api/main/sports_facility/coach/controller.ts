import { throwAppropriateError } from "@/lib/error_handler/throwError";
import prisma from "@/lib/prisma/prismaClient";
import { Coaches } from "@/app/api/main/sports_facility/coach/types";
import { UserRole } from "@prisma/client";
import { UnauthorizedError } from "@/lib/error_handler/customerErrors";

export async function getAllCoaches(hotelId: string): Promise<Coaches> {
  try {

    // Fetch all Coaches excluding sensitive fields
    const coaches = await prisma.employee.findMany({
      where: {
        hotelId: hotelId,
        role: {
          has: UserRole.entraineur,
        },
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
      },
    });

    return { coaches };
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
      "Sauf le reception manager et l'entraineur peut faire cette action"
    );
  }
}
