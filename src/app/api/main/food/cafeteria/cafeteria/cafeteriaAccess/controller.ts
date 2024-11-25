import { NotFoundError } from "@/lib/error_handler/customerErrors";
import { throwAppropriateError } from "@/lib/error_handler/throwError";
import { UserRole, Prisma } from "@prisma/client";
import prisma from "@/lib/prisma/prismaClient";
import { CafeteriasResult } from "./types";

export async function getAccessCafeterias(
  userId: string,
  hotelId: string,
  userRole: UserRole[]
): Promise<CafeteriasResult> {
  try {
    return await prisma.$transaction(async (prisma) => {
      if(userRole.includes(UserRole.admin)){
        const Cafeterias = await prisma.cafeteria.findMany({
          where: {
            hotel: { id: hotelId },
          },
          select: { id: true, name: true, description: true },
        });
  
        return { Cafeterias: Cafeterias };
      }
      const Cafeterias = await prisma.cafeteria.findMany({
        where: {
          hotel: { id: hotelId },
          cafeteriaEmployee: {
            some: {
              employeeId:userId
            },
          },
        },
        select: { id: true, name: true, description: true },
      });

      return { Cafeterias: Cafeterias };
    });
  } catch (error) {
    throw throwAppropriateError(error);
  }
}
