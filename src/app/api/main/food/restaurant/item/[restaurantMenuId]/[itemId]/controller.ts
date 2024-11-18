import {
  NotFoundError,
  ValidationError,
} from "@/lib/error_handler/customerErrors";
import { throwAppropriateError } from "@/lib/error_handler/throwError";
import { Prisma, UserRole } from "@prisma/client";
import prisma from "@/lib/prisma/prismaClient";
import {
  RestaurantMenuItemResult,
  UpdateRestaurantMenuItemData,
} from "./types";
///////////////////// get /////////////////////////////////////

export async function getRestaurantMenuItemById(
  restaurantMenuId: string,
  itemId: string,
  hotelId: string
): Promise<RestaurantMenuItemResult> {
  try {
    const existingItem = await prisma.restaurantMenuItem.findUnique({
      where: { id: itemId, restaurantMenuId: restaurantMenuId },
      include: { restaurantMenu: true },
    });

    if (!existingItem || existingItem.restaurantMenu.hotelId !== hotelId) {
      throw new NotFoundError(`Restaurant menu item non trouvée`);
    }

    return { restaurantMenuItem: existingItem };
  } catch (error) {
    throw throwAppropriateError(error);
  }
}
///////////////////////////// delete ///////////////////////////////

export async function deleteRestaurantMenuItem(
  restaurantMenuId: string,
  itemId: string,
  hotelId: string
): Promise<RestaurantMenuItemResult> {
  try {
    return await prisma.$transaction(async (prisma) => {
      const deletedItem = await prisma.restaurantMenuItem.delete({
        where: { id: itemId },
      });

      return { restaurantMenuItem: deletedItem };
    });
  } catch (error) {
    throw throwAppropriateError(error);
  }
}
/////////////////////////////// update //////////////////////////////////////////

export async function updateRestaurantMenuItem(
  restaurantMenuId: string,
  itemId: string,
  hotelId: string,
  data: UpdateRestaurantMenuItemData
): Promise<RestaurantMenuItemResult> {
  try {
    return await prisma.$transaction(async (prisma) => {
      const updateData: Prisma.RestaurantMenuItemUpdateInput = {
        name: data.name,
        description: data.description,
        category: data.category,
      };

      Object.keys(updateData).forEach((key) => {
        if (
          key in updateData &&
          updateData[key as keyof Prisma.RestaurantMenuItemUpdateInput] ===
            undefined
        ) {
          delete updateData[key as keyof Prisma.RestaurantMenuItemUpdateInput];
        }
      });

      const updatedItem = await prisma.restaurantMenuItem.update({
        where: { id: itemId },
        data: updateData,
      });

      return { restaurantMenuItem: updatedItem };
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
      "Sauf administrateur ,chef , restaurent manager peut faire cette action"
    );
  }
}

export function checkRestaurantManagerChefRole(roles: UserRole[]) {
  if (
    !roles.includes(UserRole.restaurent_Manager) &&
    !roles.includes(UserRole.chef)
  ) {
    throw new ValidationError(
      "Sauf chef , restaurent manager peut faire cette action"
    );
  }
}
