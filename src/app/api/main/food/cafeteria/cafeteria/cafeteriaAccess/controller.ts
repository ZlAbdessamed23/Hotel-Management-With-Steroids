import { NotFoundError } from "@/lib/error_handler/customerErrors";
import { throwAppropriateError } from "@/lib/error_handler/throwError";
import { UserRole, Prisma } from "@prisma/client";
import prisma from "@/lib/prisma/prismaClient";
import { CafeteriasResult } from "@/app/api/main/food/cafeteria/cafeteria/cafeteriaAccess/types";

export async function getAccessCafeterias(
  userId: string,
  hotelId: string,
  userRole: UserRole[]
): Promise<CafeteriasResult> {
  try {
    return await prisma.$transaction(async (prisma) => {
      const Cafeterias = await prisma.cafeteria.findMany({
        where: userRole.includes(UserRole.admin) ? {
          hotel: { id: hotelId }
        } : {
          hotel: { id: hotelId },
          cafeteriaEmployee: {
            some: {
              employeeId: userId
            }
          }
        },
        select: { id: true, name: true, description: true }
      });

      return { Cafeterias };
    });
  } catch (error) {
    throw throwAppropriateError(error);
  }
}
