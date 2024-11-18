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
  userId:string,
  userRole:UserRole[]
): Promise<CafeteriaMenuResult> {
  try {
    return await prisma.$transaction(async (prisma) => {
      await checkUserCafeteriaAccess(userId,cafeteriaId,userRole,prisma)
      const existingMenu = await prisma.cafeteriaMenu.findUnique({
      where: { id: cafeteriaMenuId, hotelId: hotelId ,cafeteriaId},
    });

    if (!existingMenu || existingMenu.hotelId !== hotelId) {
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
  userId:string,
  userRole:UserRole[],
): Promise<CafeteriaMenuResult> {
  try {
    return await prisma.$transaction(async (prisma) => {
      await checkUserCafeteriaAccess(userId,cafeteriaId,userRole,prisma)
      const deletedMenu = await prisma.cafeteriaMenu.delete({
        where: { id: cafeteriaMenuId, hotelId: hotelId,cafeteriaId },
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
  userId:string,
  userRole:UserRole[],
  data: UpdateCafeteriaMenuData
): Promise<CafeteriaMenuResult> {
  try {
    return await prisma.$transaction(async (prisma) => {
      await checkUserCafeteriaAccess(userId,cafeteriaId,userRole,prisma)
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



export async function checkUserCafeteriaAccess(
  userId: string,
  cafeteriaId: string,
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

    const cafeteriaEmployee = await prisma.cafeteriaEmployee.findUnique({
      where: {
        cafeteriaId_employeeId: {
          cafeteriaId,
          employeeId: userId,
        },
      },
    });

    
    if (!cafeteriaEmployee) {
      throw new UnauthorizedError(
        "L'utilisateur n'est pas autorisé à accéder à ce cafeteria"
      );
    }
  } catch (error) {
    throwAppropriateError(error);
  }
}
