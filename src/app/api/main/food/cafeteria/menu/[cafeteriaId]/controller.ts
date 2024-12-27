import { UnauthorizedError } from "@/lib/error_handler/customerErrors";
import { throwAppropriateError } from "@/lib/error_handler/throwError";
import { PrismaClient, UserRole } from "@prisma/client";
import { CafeteriaMenusResult } from "@/app/api/main/food/cafeteria/menu/[cafeteriaId]/types";
import prisma from "@/lib/prisma/prismaClient";


export async function getAllCafeteriaMenus(
    cafeteriaId:string,
    hotelId: string,
    userId : string,
    userRole:UserRole[]
  ): Promise<CafeteriaMenusResult> {
    try {
        return await prisma.$transaction(async (prisma) => {
            
            const cafeteriaMenus = await prisma.cafeteriaMenu.findMany({
            where: { hotelId: hotelId,cafeteriaId },
            select : {
              id : true,
              endTime : true,
              startTime : true,
              name : true,
              createdAt : true,
              cafeteriaId : true,
              description : true,
        
            }
          });
      
          return { CafeteriaMenus: cafeteriaMenus };})
      
    } catch (error) {
      throwAppropriateError(error);
    }
  }

