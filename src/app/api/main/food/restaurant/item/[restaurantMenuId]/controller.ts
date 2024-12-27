import prisma from "@/lib/prisma/prismaClient";
import { RestaurantMenuItemsResult } from "@/app/api/main/food/restaurant/item/[restaurantMenuId]/types";
import {
  NotFoundError,
  UnauthorizedError,
} from "@/lib/error_handler/customerErrors";
import { UserRole } from "@prisma/client";
import { throwAppropriateError } from "@/lib/error_handler/throwError";

export async function getAllRestaurantMenuItems(
  restaurantMenuId: string,
  hotelId: string
): Promise<RestaurantMenuItemsResult> {
  try {
    return await prisma.$transaction(async (prisma) => {
      const restaurantMenuItems = await 
        prisma.restaurantMenuItem.findMany({
          where: { restaurantMenuId },
          select  :{
            id : true,
            name : true,
            description : true,
            mealType : true,
            category : true,
            createdAt : true
          }
        })
      return { restaurantMenuItems };
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
    throw new UnauthorizedError(
      "Sauf administrateur ,chef , restaurent manager peut faire cette action"
    );
  }
}
