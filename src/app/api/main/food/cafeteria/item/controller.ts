import prisma from "@/lib/prisma/prismaClient";
import { AddCafeteriaMenuItemData, CafeteriaMenuItemResult } from "./types";
import {
  NotFoundError,
  UnauthorizedError,
} from "@/lib/error_handler/customerErrors";
import { UserRole } from "@prisma/client";
import { throwAppropriateError } from "@/lib/error_handler/throwError";

export async function addCafeteriaMenuItem(
  data: AddCafeteriaMenuItemData
): Promise<CafeteriaMenuItemResult> {
  try {
    return await prisma.$transaction(async (prisma) => {
      // Check if the cafeteria menu exists
      const existingCafeteriaMenu = await prisma.cafeteriaMenu.findUnique({
        where: { id: data.cafeteriaMenuId },
      });

      if (!existingCafeteriaMenu) {
        throw new NotFoundError(`Cafeteria menu non trouvée.`);
      }

      // Create the cafeteria menu item
      const cafeteriaMenuItem = await prisma.cafeteriaMenuItem.create({
        data: {
          name: data.name,
          description: data.description,
          category: data.category,
          cafeteriaMenu: {
            connect: { id: data.cafeteriaMenuId },
          },
        },
      });

      return { cafeteriaMenuItem };
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
      "Sauf chef ,restaurent manager peut faire cette action"
    );
  }
}
