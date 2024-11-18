import {
  NotFoundError,
  ValidationError,
} from "@/lib/error_handler/customerErrors";
import { throwAppropriateError } from "@/lib/error_handler/throwError";
import { Prisma, UserRole } from "@prisma/client";
import prisma from "@/lib/prisma/prismaClient";
import { CafeteriaMenuItemResult, UpdateCafeteriaMenuItemData } from "./types";
///////////////////// get /////////////////////////////////////

export async function getCafeteriaMenuItemById(
  cafeteriaMenuId: string,
  itemId: string,
  hotelId: string
): Promise<CafeteriaMenuItemResult> {
  try {
    const existingItem = await prisma.cafeteriaMenuItem.findUnique({
      where: { id: itemId, cafeteriaMenuId: cafeteriaMenuId },
      include: { cafeteriaMenu: true },
    });

    if (!existingItem || existingItem.cafeteriaMenu.hotelId !== hotelId) {
      throw new NotFoundError(`Cafeteria menu item non trouvée`);
    }

    return { cafeteriaMenuItem: existingItem };
  } catch (error) {
    throw throwAppropriateError(error);
  }
}
///////////////////////////// delete ///////////////////////////////

export async function deleteCafeteriaMenuItem(
  cafeteriaMenuId: string,
  itemId: string,
  hotelId: string
): Promise<CafeteriaMenuItemResult> {
  try {
    return await prisma.$transaction(async (prisma) => {
      const deletedItem = await prisma.cafeteriaMenuItem.delete({
        where: { id: itemId },
      });

      return { cafeteriaMenuItem: deletedItem };
    });
  } catch (error) {
    throw throwAppropriateError(error);
  }
}
/////////////////////////////// update //////////////////////////////////////////

export async function updateCafeteriaMenuItem(
  cafeteriaMenuId: string,
  itemId: string,
  hotelId: string,
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
