import { LimitExceededError, SubscriptionError,NotFoundError, UnauthorizedError } from "@/lib/error_handler/customerErrors";
import { throwAppropriateError } from "@/lib/error_handler/throwError";
import { AddCafeteriaData, CafeteriaResult, CafeteriasResult } from "@/app/api/main/food/cafeteria/cafeteria/types";
import { UserRole } from "@prisma/client";
import prisma from "@/lib/prisma/prismaClient";

export async function addCafeteria(
    data: AddCafeteriaData,
    hotelId: string,
    
  ): Promise<CafeteriaResult> {
    try {
      return await prisma.$transaction(async (prisma) => {
        const hotel = await prisma.hotel.findUnique({
          where: { id: hotelId },
          select: {
            subscription: {
              select: {
                plan: {
                  select: {
                    maxCafeterias: true,
                  },
                },
              },
            },
            _count: { select: { cafeteria: true } },
            admin: {
              select: { id: true },
            },
          },
        });
  
        if (!hotel) throw new NotFoundError("Hotel non trouvée");
        if (!hotel.subscription?.plan)
          throw new SubscriptionError("Hotel n'a pas d'abonnement actif");
        if (hotel._count.cafeteria >= hotel.subscription.plan.maxCafeterias) {
          throw new LimitExceededError(
            "Le nombre Maximum des Cafeterias pour ce plan est déja atteint"
          );
        }
  
        
  
        
        const validCafeteriaEmployee = data.cafeteriaEmployee.filter(
          (ea) => ea.employeeId !== ""
        );
  
        const createdCafeteria = await prisma.cafeteria.create({
          data: {
            name: data.name,
            description: data.description,
            hotel: { connect: { id: hotelId } },
           
            cafeteriaEmployee: {
              create: [
                
                
                ...validCafeteriaEmployee.map((ea) => ({
                  employee: { connect: { id: ea.employeeId } },
                })),
              ],
            },
          },
        });
  
        
        return { Cafeteria: createdCafeteria };
      });
    } catch (error) {
      throwAppropriateError(error);
    }
  }
  export async function getAllCafeterias(
    hotelId: string
  ): Promise<CafeteriasResult> {
    try {
      const Stoks = await prisma.cafeteria.findMany({
        where: { hotelId: hotelId },
        select: { id: true, name: true, description: true , createdAt : true },
      });
  
      return { Cafeterias: Stoks };
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