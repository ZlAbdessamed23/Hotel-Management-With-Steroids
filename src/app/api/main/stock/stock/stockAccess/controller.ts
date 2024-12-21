import { NotFoundError } from "@/lib/error_handler/customerErrors";
import { throwAppropriateError } from "@/lib/error_handler/throwError";
import { UserRole, Prisma } from "@prisma/client";
import prisma from "@/lib/prisma/prismaClient";
import { StocksResult } from "@/app/api/main/stock/stock/stockAccess/types";

export async function getAccessStocks(
  userId: string,
  hotelId: string,
  userRole: UserRole[]
): Promise<StocksResult> {
  try {
    return await prisma.$transaction(async (prisma) => {
      const Stocks = await prisma.stock.findMany({
        where: userRole.includes(UserRole.admin)
          ? {
              hotel: { id: hotelId },
            }
          : {
              hotel: { id: hotelId },
              stockEmployee: {
                some: {
                  employeeId: userId
                },
              },
            },
        select: { id: true, name: true, description: true },
      });

      return { Stocks };
    });
  } catch (error) {
    throw throwAppropriateError(error);
  }
}
