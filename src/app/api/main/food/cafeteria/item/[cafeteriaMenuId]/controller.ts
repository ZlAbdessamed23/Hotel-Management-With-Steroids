import prisma from "@/lib/prisma/prismaClient";
import { CafeteriaMenuItemsResult } from "./types";
import {
  NotFoundError,
  UnauthorizedError,
} from "@/lib/error_handler/customerErrors";
import { UserRole } from "@prisma/client";
import { throwAppropriateError } from "@/lib/error_handler/throwError";

export async function getAllCafeteriaMenuItems(
  cafeteriaMenuId: string,
  hotelId: string
): Promise<CafeteriaMenuItemsResult> {
  try {
    return await prisma.$transaction(async (prisma) => {
      const [cafeteriaMenuItems, hotel] = await Promise.all([
        prisma.cafeteriaMenuItem.findMany({
          where: { cafeteriaMenuId },
        }),
        prisma.hotel.findUnique({
          where: { id: hotelId },
          select: { hotelName: true },
        }),
      ]);

      return { cafeteriaMenuItems: cafeteriaMenuItems, hotelName : hotel?.hotelName };
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
      "Sauf administrateur ,chef ,restaurent manager peut faire cette action"
    );
  }
}
