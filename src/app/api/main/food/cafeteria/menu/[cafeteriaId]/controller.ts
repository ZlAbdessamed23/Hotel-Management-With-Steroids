import { UnauthorizedError } from "@/lib/error_handler/customerErrors";
import { throwAppropriateError } from "@/lib/error_handler/throwError";
import { PrismaClient, UserRole } from "@prisma/client";
import { CafeteriaMenusResult } from "./types";
import prisma from "@/lib/prisma/prismaClient";


export async function getAllCafeteriaMenus(
    cafeteriaId:string,
    hotelId: string,
    userId : string,
    userRole:UserRole[]
  ): Promise<CafeteriaMenusResult> {
    try {
        return await prisma.$transaction(async (prisma) => {
            await checkUserCafeteriaAccess(userId,cafeteriaId,userRole,prisma)
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