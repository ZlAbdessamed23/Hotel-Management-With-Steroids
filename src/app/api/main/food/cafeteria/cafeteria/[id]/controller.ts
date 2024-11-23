import {
    NotFoundError,
    UnauthorizedError,
} from "@/lib/error_handler/customerErrors";
import { throwAppropriateError } from "@/lib/error_handler/throwError";
import { Prisma, UserRole } from "@prisma/client";
import prisma from "@/lib/prisma/prismaClient";
import { CafeteriaResult, UpdateCafeteriaData } from "@/app/api/main/food/cafeteria/cafeteria/[id]/types";


export async function updateCafeteria(
    CafeteriaId: string,
    hotelId:string,
    data: UpdateCafeteriaData
): Promise<{ Cafeteria: any }> {
    try {
        return await prisma.$transaction(async (prisma) => {
            const updateData: Prisma.CafeteriaUpdateInput = {};

            if (data.name !== undefined) updateData.name = data.name;
            if (data.description !== undefined) updateData.description = data.description;

            if (Array.isArray(data.cafeteriaEmployee)) {
                const validCafeteriaEmployee = data.cafeteriaEmployee.filter((ea) => ea.employeeId !== "");

                updateData.cafeteriaEmployee = {
                    deleteMany: {
                        cafeteriaId: CafeteriaId,
                    },
                    create: validCafeteriaEmployee.map((ea) => ({
                        employee: { connect: { id: ea.employeeId } },
                    })),
                };
            }

            if (Object.keys(updateData).length > 0) {
                const updatedCafeteria = await prisma.cafeteria.update({
                    where: { id: CafeteriaId ,hotelId},
                    data: updateData,
                });
                console.log(updatedCafeteria);
                return { Cafeteria: updatedCafeteria };
            }

            const existingCafeteria = await prisma.cafeteria.findUnique({
                where: { id: CafeteriaId,hotelId },
                select : {
                    id : true,
                  location : true,
                  name : true,
                  description : true,
                  createdAt : true    
                  }
            });
            return { Cafeteria: existingCafeteria };
        });
    } catch (error) {
        throw throwAppropriateError(error);
    }
}

export async function getCafeteriaById(
    CafeteriaId: string,
    hotelId: string,

): Promise<CafeteriaResult> {
    try {
        const existingCafeteria = await prisma.cafeteria.findUnique({
            where: { id: CafeteriaId },
            include: {
                hotel: true,
                cafeteriaEmployee: {
                    include: {

                        employee: true,
                    },
                },
            },
        });

        if (!existingCafeteria || existingCafeteria.hotel.id !== hotelId) {
            throw new NotFoundError(`Cafeteria non trouvée`);
        }


        console.log(existingCafeteria);
        return { Cafeteria: existingCafeteria };
    } catch (error) {
        throw throwAppropriateError(error);
    }
}

export async function deleteCafeteria(
    CafeteriaId: string,
    hotelId: string,

): Promise<{ Cafeteria: any }> {
    try {
        return await prisma.$transaction(async (prisma) => {
        const deletedCafeteria = await prisma.cafeteria.delete({
                where: { id: CafeteriaId, hotelId },
                select : {
                    id : true,
                  location : true,
                  name : true,
                  description : true,
                  createdAt : true    
                  }
            });

            return { Cafeteria: deletedCafeteria };
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