import {
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from "@/lib/error_handler/customerErrors";
import { throwAppropriateError } from "@/lib/error_handler/throwError";
import { Prisma, PrismaClient, UserRole } from "@prisma/client";
import prisma from "@/lib/prisma/prismaClient";
import { CafeteriaMenuResult, UpdateCafeteriaMenuData } from "./types";
import { updateCafeteriaMenuStatistics } from "@/app/api/main/statistics/statistics";

export async function getCafeteriaMenuById(
  cafeteriaMenuId: string,
  cafeteriaId:string,
  hotelId: string,

): Promise<CafeteriaMenuResult> {
  try {
    return await prisma.$transaction(async (prisma) => {
      
      const existingMenu = await prisma.cafeteriaMenu.findUnique({
      where: { id: cafeteriaMenuId, hotelId: hotelId ,cafeteriaId},select : {
        id : true,
        endTime : true,
        startTime : true,
        name : true,
        createdAt : true,
        cafeteriaId : true,
        description : true,
  
      }
    });

    if (!existingMenu ) {
      throw new NotFoundError(`Cafeteria menu non trouvée`);
    }

    return { CafeteriaMenu: existingMenu };})
    
  } catch (error) {
    throw throwAppropriateError(error);
  }
}

export async function deleteCafeteriaMenu(
  cafeteriaMenuId: string,
  cafeteriaId:string,
  hotelId: string,

): Promise<CafeteriaMenuResult> {
  try {
    return await prisma.$transaction(async (prisma) => {
      
      const deletedMenu = await prisma.cafeteriaMenu.delete({
        where: { id: cafeteriaMenuId, hotelId: hotelId,cafeteriaId },select : {
          id : true,
          endTime : true,
          startTime : true,
          name : true,
          createdAt : true,
          cafeteriaId : true,
          description : true,
    
        }
      });
      await updateCafeteriaMenuStatistics(hotelId, "remove", prisma);
      return { CafeteriaMenu: deletedMenu };
    });
  } catch (error) {
    throw throwAppropriateError(error);
  }
}

export async function updateCafeteriaMenu(
  cafeteriaMenuId: string,
  cafeteriaId:string,
  hotelId: string,
  
  data: UpdateCafeteriaMenuData
): Promise<CafeteriaMenuResult> {
  try {
    return await prisma.$transaction(async (prisma) => {
      
      const updateData: Prisma.CafeteriaMenuUpdateInput = {
        name: data.name,
        description: data.description,
        startTime: data.startTime,
        endTime: data.endTime,
      };

      Object.keys(updateData).forEach((key) => {
        if (
          key in updateData &&
          updateData[key as keyof Prisma.CafeteriaMenuUpdateInput] === undefined
        ) {
          delete updateData[key as keyof Prisma.CafeteriaMenuUpdateInput];
        }
      });

      const updatedMenu = await prisma.cafeteriaMenu.update({
        where: { id: cafeteriaMenuId,cafeteriaId,hotelId },
        data: updateData,
      });

      return { CafeteriaMenu: updatedMenu };
    });
  } catch (error) {
    throw throwAppropriateError(error);
  }
}



