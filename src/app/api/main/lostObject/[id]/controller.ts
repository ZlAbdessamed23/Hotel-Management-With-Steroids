import { throwAppropriateError } from "@/lib/error_handler/throwError";
import { LostObject } from "./types";
import prisma from "@/lib/prisma/prismaClient";
import { UserRole } from "@prisma/client";
import { UnauthorizedError } from "@/lib/error_handler/customerErrors";

export async function deleteLostObjectById(
    lostObjectId: string,
    hotelId: string
  ): Promise<LostObject> {
    try {
      const deletedLostObject = await prisma.lostObject.delete({
        where: {
          id: lostObjectId,
          hotelId: hotelId,
        },
        
      });
  
      
  
      return { LostObject: deletedLostObject };
    } catch (error) {
      throwAppropriateError(error);
    }
  }
  export function checkAdminReceptionGvernementRole(roles: UserRole[]) {
    if (!roles.includes(UserRole.admin)&&!roles.includes(UserRole.gouvernement)&&!roles.includes(UserRole.entretien_Menager)&&!roles.includes(UserRole.reception_Manager)) {
      throw new UnauthorizedError(
        "Sauf l'Administrateur , reception , governement peut faire cette action"
      );
    }
  }