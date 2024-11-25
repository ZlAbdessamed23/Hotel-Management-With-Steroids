import { NotFoundError } from "@/lib/error_handler/customerErrors";
import { throwAppropriateError } from "@/lib/error_handler/throwError";
import { UserRole, Prisma } from "@prisma/client";
import prisma from "@/lib/prisma/prismaClient";
import { StocksResult } from "./types";

export async function getAccessStocks(
  userId: string,
  hotelId: string,
  userRole: UserRole[]
): Promise<StocksResult> {
  try {
    return await prisma.$transaction(async (prisma) => {
      if(userRole.includes(UserRole.admin)){
        const Stocks = await prisma.stock.findMany({
          where: {
            hotel: { id: hotelId },
          },
          select: { id: true, name: true, description: true },
        });
  
        return { Stocks: Stocks };
      }
      const Stocks = await prisma.stock.findMany({
        where: {
          hotel: { id: hotelId },
          stockEmployee: {
            some: {
              employeeId:userId
            },
          },
        },
        select: { id: true, name: true, description: true },
      });

      return { Stocks: Stocks };
    });
  } catch (error) {
    throw throwAppropriateError(error);
  }
}
