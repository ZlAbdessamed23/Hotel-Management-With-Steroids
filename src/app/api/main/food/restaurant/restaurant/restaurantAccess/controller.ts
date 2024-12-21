import { NotFoundError } from "@/lib/error_handler/customerErrors";
import { throwAppropriateError } from "@/lib/error_handler/throwError";
import { UserRole, Prisma } from "@prisma/client";
import prisma from "@/lib/prisma/prismaClient";
import { RestaurantsResult } from "@/app/api/main/food/restaurant/restaurant/restaurantAccess/types";

export async function getAccessRestaurants(
  userId: string,
  hotelId: string,
  userRole: UserRole[]
): Promise<RestaurantsResult> {
  try {
    return await prisma.$transaction(async (prisma) => {
      const Restaurants = await prisma.restaurant.findMany({
        where: userRole.includes(UserRole.admin) ? {
          hotel: { id: hotelId }
        } : {
          hotel: { id: hotelId },
          restaurantEmployee: {
            some: {
              employeeId: userId
            }
          }
        },
        select: { id: true, name: true, description: true }
      });

      return { Restaurants };
    });
  } catch (error) {
    throw throwAppropriateError(error);
  }
}