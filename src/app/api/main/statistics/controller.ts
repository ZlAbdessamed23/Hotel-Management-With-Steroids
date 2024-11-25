import { throwAppropriateError } from "@/lib/error_handler/throwError";
import prisma from "@/lib/prisma/prismaClient";
import { StatisticsResult } from "@/app/api/main/statistics/types";
import { Statistics, UserRole } from "@prisma/client";
import { UnauthorizedError } from "@/lib/error_handler/customerErrors";
export async function getAllStatistics(
  hotelId: string
): Promise<StatisticsResult> {
  try {
    console.log("Fetching all statistics");

    // Fetch all employees excluding sensitive fields
    const statistics = await prisma.statistics.findMany({
      where: { hotelId: hotelId },
    });

    

    return { Statistics: statistics };
  } catch (error) {
    throwAppropriateError(error);
  }
}
export function checkAdminRole(roles: UserRole[]) {
  if (!roles.includes(UserRole.admin)) {
    throw new UnauthorizedError("Sauf l'administrateur peut voire les statistiques");
  };
};

