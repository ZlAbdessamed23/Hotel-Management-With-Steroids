import {
    NotFoundError,
    UnauthorizedError,
} from "@/lib/error_handler/customerErrors";
import { throwAppropriateError } from "@/lib/error_handler/throwError";
import { Prisma, UserRole } from "@prisma/client";
import prisma from "@/lib/prisma/prismaClient";
import { RestaurantResult, UpdateRestaurantData } from "@/app/api/main/food/restaurant/restaurant/[id]/types";


export async function updateRestaurant(
    RestaurantId: string,
    hotelId:string,
    data: UpdateRestaurantData
): Promise<{ Restaurant: any }> {
    try {
        return await prisma.$transaction(async (prisma) => {
            const updateData: Prisma.RestaurantUpdateInput = {};

            if (data.name !== undefined) updateData.name = data.name;
            if (data.description !== undefined) updateData.description = data.description;

            if (Array.isArray(data.restaurantEmployee)) {
                const validRestaurantEmployee = data.restaurantEmployee.filter((ea) => ea.employeeId !== "");

                updateData.restaurantEmployee = {
                    deleteMany: {
                        restaurantId: RestaurantId,
                    },
                    create: validRestaurantEmployee.map((ea) => ({
                        employee: { connect: { id: ea.employeeId } },
                    })),
                };
            }

            if (Object.keys(updateData).length > 0) {
                const updatedRestaurant = await prisma.restaurant.update({
                    where: { id: RestaurantId ,hotelId},
                    data: updateData,
                });
                console.log(updatedRestaurant);
                return { Restaurant: updatedRestaurant };
            }

            const existingRestaurant = await prisma.restaurant.findUnique({
                where: { id: RestaurantId,hotelId },
            });
            return { Restaurant: existingRestaurant };
        });
    } catch (error) {
        throw throwAppropriateError(error);
    }
}

export async function getRestaurantById(
    RestaurantId: string,
    hotelId: string,

): Promise<RestaurantResult> {
    try {
        const existingRestaurant = await prisma.restaurant.findUnique({
            where: { id: RestaurantId },
            include: {
                hotel: true,
                restaurantEmployee: {
                    include: {

                        employee: true,
                    },
                },
            },
        });

        if (!existingRestaurant || existingRestaurant.hotel.id !== hotelId) {
            throw new NotFoundError(`Restaurant non trouvée`);
        }


        console.log(existingRestaurant);
        return { Restaurant: existingRestaurant };
    } catch (error) {
        throw throwAppropriateError(error);
    }
}

export async function deleteRestaurant(
    RestaurantId: string,
    hotelId: string,

): Promise<{ Restaurant: any }> {
    try {
        return await prisma.$transaction(async (prisma) => {
        const deletedRestaurant = await prisma.restaurant.delete({
                where: { id: RestaurantId, hotelId },
            });

            return { Restaurant: deletedRestaurant };
        });
    } catch (error) {
        throw throwAppropriateError(error);
    }
}
export function checkAdminRole(roles: UserRole[]) {
    if (
      !roles.includes(UserRole.admin) 
    ) {
      throw new UnauthorizedError(
        "Sauf l'Admin peut faire cette action"
      );
    }
  }