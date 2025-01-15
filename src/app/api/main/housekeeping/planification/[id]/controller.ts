import {
    NotFoundError,
    UnauthorizedError,
    ValidationError,
  } from "@/lib/error_handler/customerErrors";
  import { throwAppropriateError } from "@/lib/error_handler/throwError";
  import { Prisma, UserRole } from "@prisma/client";
  import {
    UpdateHouseKeepingPlanificationData,
    HouseKeepingPlanificationResult,
  } from "@/app/api/main/housekeeping/planification/[id]/types";
  import prisma from "@/lib/prisma/prismaClient";
  
  // Get seance
  export async function getHouseKeepingPlanificationById(
   
    houseKeepingPlanificationId: string,
    hotelId: string
  ): Promise<HouseKeepingPlanificationResult> {
    try {
      const existingHouseKeepingPlanification = await prisma.houseKeepingPlanification.findUnique({
        where: { id: houseKeepingPlanificationId, hotelId },
        select : {
          id : true,
          description : true,
          end : true,
          title : true,
          start : true,
          
        }
       
      });
  
      if (!existingHouseKeepingPlanification ) {
        throw new NotFoundError(
          `séance non trouvée`
        );
      }
  
      return { HouseKeepingPlanification: existingHouseKeepingPlanification };
    } catch (error) {
      throw throwAppropriateError(error);
    }
  }
  
  // Delete seance
  export async function deleteHouseKeepingPlanification(
    
    houseKeepingPlanificationId: string,
    hotelId: string
  ): Promise<HouseKeepingPlanificationResult> {
    try {
      return await prisma.$transaction(async (prisma) => {
        
  
        const deletedhouseKeepingPlanification = await prisma.houseKeepingPlanification.delete({
          where: { id: houseKeepingPlanificationId },
          select : {
            id : true,
            description : true,
            end : true,
            title : true,
            start : true,
            
          }
        });
  
        return { HouseKeepingPlanification: deletedhouseKeepingPlanification };
      });
    } catch (error) {
      throw throwAppropriateError(error);
    }
  }
  
  // Update seance
  export async function updateHouseKeepingPlanification(
   
    houseKeepingPlanificationId: string,
    hotelId: string,
    data: UpdateHouseKeepingPlanificationData
  ): Promise<HouseKeepingPlanificationResult> {
    try {
      return await prisma.$transaction(async (prisma) => {
        const existinghouseKeepingPlanification = await prisma.houseKeepingPlanification.findUnique({
          where: { id: houseKeepingPlanificationId, hotelId },
          select : {
            id : true,
            description : true,
            end : true,
            title : true,
            start : true,
            
          }
         
        });
  
        if (!existinghouseKeepingPlanification ) {
          throw new NotFoundError(
            `séance non trouvée`
          );
        }
  
        const updateData: Prisma.HouseKeepingPlanificationUpdateInput = {
          title: data.title,
          description: data.description,
          start: data.start,
          end: data.end,
        };
  
        Object.keys(updateData).forEach((key) => {
          if (
            key in updateData &&
            updateData[key as keyof Prisma.HouseKeepingPlanificationUpdateInput] === undefined
          ) {
            delete updateData[key as keyof Prisma.HouseKeepingPlanificationUpdateInput];
          }
        });
  
        const updatedhouseKeepingPlanification = await prisma.houseKeepingPlanification.update({
          where: { id: houseKeepingPlanificationId },
          data: updateData,
        });
  
        return { HouseKeepingPlanification: updatedhouseKeepingPlanification };
      });
    } catch (error) {
      throw throwAppropriateError(error);
    }
  }
  
  // Role check functions (you may need to adjust these based on your specific requirements)
  export function checkReceptionManagerReceptionistGouvernementRole(roles: UserRole[]) {
    if (
       !roles.includes(UserRole.gouvernante)&&!roles.includes(UserRole.reception_Manager) &&
       !roles.includes(UserRole.receptionist)
    ) {
      throw new UnauthorizedError(
        "Sauf  gouvernement receptionist reception manager peut faire cette action"
      );
    }
  }
  
  export function checkReceptionManagerReceptionistGouvernementAdminRole(roles: UserRole[]) {
      if (
        !roles.includes(UserRole.reception_Manager) &&
        !roles.includes(UserRole.receptionist)&& !roles.includes(UserRole.gouvernante)&& !roles.includes(UserRole.admin)
      ) {
        throw new UnauthorizedError(
          "Sauf receptionist , reception , gouvernement , admin peut faire cette action"
        );
      }
    }