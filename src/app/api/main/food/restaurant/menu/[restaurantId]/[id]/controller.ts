import {
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from "@/lib/error_handler/customerErrors";
import { throwAppropriateError } from "@/lib/error_handler/throwError";
import { Prisma, PrismaClient, UserRole } from "@prisma/client";
import prisma from "@/lib/prisma/prismaClient";
import { RestaurantMenuResult, UpdateRestaurantMenuData } from "./types";

export async function getRestaurantMenuById(
  restaurantMenuId: string,
  restaurantId:string,
  hotelId: string,
  userId:string,
  userRole:UserRole[]
): Promise<RestaurantMenuResult> {
  try {
    return await prisma.$transaction(async (prisma) => {

      await checkUserRestaurantAccess(userId,restaurantId,userRole,prisma)
      const existingMenu = await prisma.restaurantMenu.findUnique({
        where: { id: restaurantMenuId, hotelId: hotelId,restaurantId },
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
  
      if (!existingMenu || existingMenu.hotelId !== hotelId) {
        throw new NotFoundError(`Restaurant menu non trouvée`);
      }
  
      return { RestaurantMenu: existingMenu };
    })
    
  } catch (error) {
    throw throwAppropriateError(error);
  }
}

export async function deleteRestaurantMenu(
  restaurantMenuId: string,
  restaurantId:string,
  hotelId: string,
  userId:string,
  userRole:UserRole[]
): Promise<RestaurantMenuResult> {
  try {
    return await prisma.$transaction(async (prisma) => {
      await checkUserRestaurantAccess(userId,restaurantId,userRole,prisma)
      const deletedMenu = await prisma.restaurantMenu.delete({
        where: { id: restaurantMenuId, hotelId: hotelId,restaurantId },
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

      return { RestaurantMenu: deletedMenu };
    });
  } catch (error) {
    throw throwAppropriateError(error);
  }
}

export async function updateRestaurantMenu(
  restaurantMenuId: string,
  restaurantId:string,
  hotelId: string,
  userId:string,
  userRole:UserRole[],
  data: UpdateRestaurantMenuData
): Promise<RestaurantMenuResult> {
  try {
    return await prisma.$transaction(async (prisma) => {
      await checkUserRestaurantAccess(userId,restaurantId,userRole,prisma)
      const updateData: Prisma.RestaurantMenuUpdateInput = {
        name: data.name,
        description: data.description,
        lunchStartTime: data.lunchStartTime,
        lunchEndTime: data.lunchEndTime,
        dinnerStartTime: data.dinnerStartTime,
        dinnerEndTime: data.dinnerEndTime,
      };

      Object.keys(updateData).forEach((key) => {
        if (
          key in updateData &&
          updateData[key as keyof Prisma.RestaurantMenuUpdateInput] ===
            undefined
        ) {
          delete updateData[key as keyof Prisma.RestaurantMenuUpdateInput];
        }
      });

      const updatedMenu = await prisma.restaurantMenu.update({
        where: { id: restaurantMenuId,hotelId,restaurantId },
        data: updateData,
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

      return { RestaurantMenu: updatedMenu };
    });
  } catch (error) {
    throw throwAppropriateError(error);
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