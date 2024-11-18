import { LimitExceededError, SubscriptionError,NotFoundError, UnauthorizedError } from "@/lib/error_handler/customerErrors";
import { throwAppropriateError } from "@/lib/error_handler/throwError";
import { AddStockData, StockResult, StocksResult } from "@/app/api/main/stock/stock/types";
import { UserRole } from "@prisma/client";
import prisma from "@/lib/prisma/prismaClient";

export async function addStock(
    data: AddStockData,
    hotelId: string,
    
  ): Promise<StockResult> {
    try {
      return await prisma.$transaction(async (prisma) => {
        const hotel = await prisma.hotel.findUnique({
          where: { id: hotelId },
          select: {
            subscription: {
              select: {
                plan: {
                  select: {
                    maxReports: true,
                  },
                },
              },
            },
            _count: { select: { stock: true } },
            admin: {
              select: { id: true },
            },
          },
        });
  
        if (!hotel) throw new NotFoundError("Hotel non trouvée");
        if (!hotel.subscription?.plan)
          throw new SubscriptionError("Hotel n'a pas d'abonnement actif");
        if (hotel._count.stock >= hotel.subscription.plan.maxReports) {
          throw new LimitExceededError(
            "Le nombre Maximum des stocks pour ce plan est déja atteint"
          );
        }
  
        
  
        
        const validstockEmployee = data.stockEmployee.filter(
          (ea) => ea.employeeId !== ""
        );
  
        const createdStock = await prisma.stock.create({
          data: {
            name: data.name,
            description: data.description,
            hotel: { connect: { id: hotelId } },
           
            stockEmployee: {
              create: [
                
                
                ...validstockEmployee.map((ea) => ({
                  employee: { connect: { id: ea.employeeId } },
                })),
              ],
            },
          },
        });
  
        
        return { Stock: createdStock };
      });
    } catch (error) {
      throwAppropriateError(error);
    }
  }
  export async function getAllStocks(
    hotelId: string
  ): Promise<StocksResult> {
    try {
      const Stoks = await prisma.stock.findMany({
        where: { hotelId: hotelId },
        select: { id: true, name: true, description: true , createdAt : true },
      });
  
      return { Stocks: Stoks };
    } catch (error) {
      throwAppropriateError(error);
    }
  }
  export function checkAdminRole(roles: UserRole[]) {
    if (
      !roles.includes(UserRole.admin) 
    ) {
      throw new UnauthorizedError(
        "Sauf l'Admin peut faire cette action"
      );
    }
  }