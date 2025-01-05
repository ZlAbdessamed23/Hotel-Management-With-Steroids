import prisma from "@/lib/prisma/prismaClient";
import {
  AddLostObjectData,
  LostObject,
  LostObjects,
} from "@/app/api/main/housekeeping/lostObject/types";


import {
  ConflictError,
  SubscriptionError,
  UnauthorizedError,
  ValidationError,
} from "@/lib/error_handler/customerErrors";

import { throwAppropriateError } from "@/lib/error_handler/throwError";
import { UserRole } from "@prisma/client";


/////////////////////////// Add LostObject //////////////////////////////////
export async function addLostObject(
  data: AddLostObjectData,
  hotelId: string
): Promise<LostObject> {
  try {
    return await prisma.$transaction(async (prisma) => {
      

      const newLostObject = await prisma.lostObject.create({
        data: {
          ...data,
          
          hotelId,
        },
        select : {
          description : true,
          id : true,
          location : true,
          name : true,
          
        }
      });

      

      return { LostObject: newLostObject };
    });
  } catch (error) {
    throwAppropriateError(error);
  }
}
//////////////////////// Get all LostObject ////////////////////////////////
export async function getAllLostObjects(hotelId: string): Promise<LostObjects> {
  try {
    // Fetch all LostObjects excluding sensitive fields
    const LostObjects = await prisma.lostObject.findMany({
      where: { hotelId: hotelId },
      select : {
        description : true,
        id : true,
        location : true,
        name : true,
        
      }
     
    });

    return { LostObjects: LostObjects };
  } catch (error) {
    throwAppropriateError(error);
  }
}

export function checkAdminReceptionManagerReceptionistGvernementRole(roles: UserRole[]) {
  if (!roles.includes(UserRole.admin)&&!roles.includes(UserRole.gouvernante)&&!roles.includes(UserRole.reception_Manager)&&!roles.includes(UserRole.receptionist)) {
    throw new UnauthorizedError(
      "Sauf l'Administrateur gouvernanat resepsionist reception manager peut faire cette action"
    );
  }
}
export function checkReceptionManagerReceptionistGvernementRole(roles: UserRole[]) {
  if (!roles.includes(UserRole.gouvernante)&&!roles.includes(UserRole.reception_Manager)&&!roles.includes(UserRole.receptionist)) {
    throw new UnauthorizedError(
      "Sauf gouvernanat resepsionist reception manager peut faire cette action"
    );
  }
}


