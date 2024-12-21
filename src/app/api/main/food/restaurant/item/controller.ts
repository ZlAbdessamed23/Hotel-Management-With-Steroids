import prisma from "@/lib/prisma/prismaClient";
import { AddRestaurantMenuItemData, RestaurantMenuItemResult } from "@/app/api/main/food/restaurant/item/types";
import {
  NotFoundError,
  UnauthorizedError,
} from "@/lib/error_handler/customerErrors";
import { UserRole } from "@prisma/client";
import { throwAppropriateError } from "@/lib/error_handler/throwError";

export async function addRestaurantMenuItem(
  data: AddRestaurantMenuItemData
): Promise<RestaurantMenuItemResult> {
  try {
    return await prisma.$transaction(async (prisma) => {
      
      // Create the cafeteria menu item
      const restaurantMenuItem = await prisma.restaurantMenuItem.create({
        data: {
          name: data.name,
          description: data.description,
          mealType: data.mealType,
          category: data.category,
          restaurantMenu: {
            connect: { id: data.restaurantMenuId },
          },
        },
        select  :{
          id : true,
          name : true,
          description : true,
          mealType : true,
          category : true,
          createdAt : true
        }
      });

      return { restaurantMenuItem };
    });
  } catch (error) {
    throw throwAppropriateError(error);
  }
}

export function checkRestaurantManagerChefRole(roles: UserRole[]) {
  if (
    !roles.includes(UserRole.restaurent_Manager) &&
    !roles.includes(UserRole.chef)
  ) {
    throw new UnauthorizedError(
      "Sauf chef , restaurent manager peut faire cette action"
    );
  }
}
