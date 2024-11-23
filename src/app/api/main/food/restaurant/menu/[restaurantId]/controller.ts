import { UnauthorizedError } from "@/lib/error_handler/customerErrors";
import { throwAppropriateError } from "@/lib/error_handler/throwError";
import { PrismaClient, UserRole } from "@prisma/client";
import { RestaurantMenusResult } from "@/app/api/main/food/restaurant/menu/[restaurantId]/types";
import prisma from "@/lib/prisma/prismaClient";


export async function getAllRestaurantMenus(
    restaurantId:string,
    hotelId: string,
    userId : string,
    userRole:UserRole[]
  ): Promise<RestaurantMenusResult> {
    try {
        return await prisma.$transaction(async (prisma) => {
            await checkUserRestaurantAccess(userId,restaurantId,userRole,prisma)
            const RestaurantMenus = await prisma.restaurantMenu.findMany({
            where: { hotelId: hotelId,restaurantId },
            select : {
              id : true,
              name  :true,
              createdAt : true,
              description : true,
              lunchStartTime : true,
               lunchEndTime : true,
               dinnerStartTime : true,
               dinnerEndTime : true,
               restaurantId : true,
               hotelId:true
                
          
            }
          });
      
          return { RestaurantMenus: RestaurantMenus };})
      
    } catch (error) {
      throwAppropriateError(error);
    }
  }

export async function checkUserRestaurantAccess(
    userId: string,
    restaurantId: string,
    userRole: UserRole[],
    prisma: Omit<
      PrismaClient,
      "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
    >
  ): Promise<void> {
    try {
     
      if (userRole.includes(UserRole.admin)) {
        return;
      }
  
      const RestaurantEmployee = await prisma.restaurantEmployee.findUnique({
        where: {
          restaurantId_employeeId: {
            restaurantId,
            employeeId: userId,
          },
        },
      });
  
      
      if (!RestaurantEmployee) {
        throw new UnauthorizedError(
          "L'utilisateur n'est pas autorisé à accéder à ce Restaurant"
        );
      }
    } catch (error) {
      throwAppropriateError(error);
    }
  }