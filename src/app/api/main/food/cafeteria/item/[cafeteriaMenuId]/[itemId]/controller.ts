import {
  NotFoundError,
  ValidationError,
} from "@/lib/error_handler/customerErrors";
import { throwAppropriateError } from "@/lib/error_handler/throwError";
import { Prisma, UserRole } from "@prisma/client";
import prisma from "@/lib/prisma/prismaClient";
import { CafeteriaMenuItemResult, UpdateCafeteriaMenuItemData } from "@/app/api/main/food/cafeteria/item/[cafeteriaMenuId]/[itemId]/types";
///////////////////// get /////////////////////////////////////

export async function getCafeteriaMenuItemById(
  cafeteriaMenuId: string,
  itemId: string,
  
): Promise<CafeteriaMenuItemResult> {
  try {
    const existingItem = await prisma.cafeteriaMenuItem.findUnique({
      where: { id: itemId, cafeteriaMenuId: cafeteriaMenuId },
      select : {
        id : true,
        name : true,
        description : true,
        cafeteriaMenuId : true,
        category : true,
        
      }
      
    });

    if (!existingItem ) {
      throw new NotFoundError(`Cafeteria menu item non trouvée`);
    }

    return { cafeteriaMenuItem: existingItem };
  } catch (error) {
    throw throwAppropriateError(error);
  }
}
///////////////////////////// delete ///////////////////////////////

export async function deleteCafeteriaMenuItem(
  
  itemId: string,
  
): Promise<CafeteriaMenuItemResult> {
  try {
    return await prisma.$transaction(async (prisma) => {
      const deletedItem = await prisma.cafeteriaMenuItem.delete({
        where: { id: itemId },
        select : {
          id : true,
          name : true,
          description : true,
          cafeteriaMenuId : true,
          category : true,
          
        }
      });

      return { cafeteriaMenuItem: deletedItem };
    });
  } catch (error) {
    throw throwAppropriateError(error);
  }
}
/////////////////////////////// update //////////////////////////////////////////

export async function updateCafeteriaMenuItem(
 
  itemId: string,
  
  data: UpdateCafeteriaMenuItemData
): Promise<CafeteriaMenuItemResult> {
  try {
    return await prisma.$transaction(async (prisma) => {
      const updateData: Prisma.CafeteriaMenuItemUpdateInput = {
        name: data.name,
        description: data.description,
        category: data.category,
      };

      Object.keys(updateData).forEach((key) => {
        if (
          key in updateData &&
          updateData[key as keyof Prisma.CafeteriaMenuItemUpdateInput] ===
            undefined
        ) {
          delete updateData[key as keyof Prisma.CafeteriaMenuItemUpdateInput];
        }
      });

      const updatedItem = await prisma.cafeteriaMenuItem.update({
        where: { id: itemId },
        data: updateData,
        select : {
          id : true,
          name : true,
          description : true,
          cafeteriaMenuId : true,
          category : true,
          
        }
      });

      return { cafeteriaMenuItem: updatedItem };
    });
  } catch (error) {
    throw throwAppropriateError(error);
  }
}

export function checkRestaurantManagerChefAdminRole(roles: UserRole[]) {
  if (
    !roles.includes(UserRole.restaurent_Manager) &&
    !roles.includes(UserRole.admin) &&
    !roles.includes(UserRole.chef)
  ) {
    throw new ValidationError(
      "Sauf administrateur ,chef ,restaurent manager peut faire cette action"
    );
  }
}

export function checkRestaurantManagerChefRole(roles: UserRole[]) {
  if (
    !roles.includes(UserRole.restaurent_Manager) &&
    !roles.includes(UserRole.chef)
  ) {
    throw new ValidationError(
      "Sauf chef ,restaurent manager peut faire cette action"
    );
  }
}
