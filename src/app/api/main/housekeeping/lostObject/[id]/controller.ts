import { throwAppropriateError } from "@/lib/error_handler/throwError";
import { LostObject, UpdateLostObjectData } from "@/app/api/main/housekeeping/lostObject/[id]/types";
import prisma from "@/lib/prisma/prismaClient";
import { Prisma, UserRole } from "@prisma/client";
import { UnauthorizedError } from "@/lib/error_handler/customerErrors";

export async function updateLostObject(
  lostObjectId: string,
  hotelId: string,
  data: UpdateLostObjectData
): Promise<LostObject> {
  try {
    // Check user roles before updating
    // Assuming roles are available; adjust as necessary
    const roles: UserRole[] = []; // Replace with actual roles retrieval logic
    

    return await prisma.$transaction(async (prisma) => {
      const updateData: Prisma.LostObjectUpdateInput = {
        description: data.description,
        location: data.location,
        name: data.name,
      };

      // Remove undefined fields
      Object.keys(updateData).forEach((key) => {
        if (
          key in updateData &&
          updateData[key as keyof Prisma.LostObjectUpdateInput] === undefined
        ) {
          delete updateData[key as keyof Prisma.LostObjectUpdateInput];
        }
      });

      const updatedLostObject = await prisma.lostObject.update({
        where: { id: lostObjectId, hotelId: hotelId },
        data: updateData,
        select: {
          description: true,
          id: true,
          location: true,
          name: true,
        },
      });

      return { LostObject: updatedLostObject };
    });
  } catch (error) {
    throw throwAppropriateError(error);
  }
}

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
      select: {
        description: true,
        id: true,
        location: true,
        name: true,

      }

    });
    return { LostObject: deletedLostObject };
  } catch (error) {
    throwAppropriateError(error);
  };
};

export function checkReceptionManagerReceptionistGvernementRole(roles: UserRole[]) {
  if (!roles.includes(UserRole.gouvernante)&&!roles.includes(UserRole.reception_Manager)&&!roles.includes(UserRole.receptionist)) {
    throw new UnauthorizedError(
      "Sauf gouvernanat resepsionist reception manager peut faire cette action"
    );
  }
}