import {
    NotFoundError,
    UnauthorizedError,
} from "@/lib/error_handler/customerErrors";
import { throwAppropriateError } from "@/lib/error_handler/throwError";
import { Prisma, UserRole } from "@prisma/client";
import prisma from "@/lib/prisma/prismaClient";
import { StockResult, UpdateStockData } from "@/app/api/main/stock/stock/[id]/types";


export async function updateStock(
    StockId: string,
    hotelId: string,
    data: UpdateStockData
): Promise<{ Stock: any }> {
    try {
        return await prisma.$transaction(async (prisma) => {
            const updateData: Prisma.StockUpdateInput = {};

            if (data.name !== undefined) updateData.name = data.name;
            if (data.description !== undefined) updateData.description = data.description;

            if (Array.isArray(data.stockEmployee)) {
                const validStockEmployee = data.stockEmployee.filter((ea) => ea.employeeId !== "");

                updateData.stockEmployee = {
                    deleteMany: {
                        stockId: StockId,
                    },
                    create: validStockEmployee.map((ea) => ({
                        employee: { connect: { id: ea.employeeId } },
                    })),
                };
            }

            if (Object.keys(updateData).length > 0) {
                const updatedStock = await prisma.stock.update({
                    where: { id: StockId, hotelId },
                    data: updateData,
                });
                console.log(updatedStock);
                return { Stock: updatedStock };
            }

            const existingStock = await prisma.stock.findUnique({
                where: { id: StockId, hotelId },
            });
            return { Stock: existingStock };
        });
    } catch (error) {
        throw throwAppropriateError(error);
    }
}

export async function getStockById(
    StockId: string,
    hotelId: string,

): Promise<StockResult> {
    try {
        const existingStock = await prisma.stock.findUnique({
            where: { id: StockId },
            include: {
                hotel: true,
                stockEmployee: {
                    include: {

                        employee: true,
                    },
                },
            },
        });

        if (!existingStock || existingStock.hotel.id !== hotelId) {
            throw new NotFoundError(`Stock non trouvée`);
        }


        console.log(existingStock);
        return { Stock: existingStock };
    } catch (error) {
        throw throwAppropriateError(error);
    }
}

export async function deleteStock(
    StockId: string,
    hotelId: string,

): Promise<{ Stock: any }> {
    try {
        return await prisma.$transaction(async (prisma) => {
            const deletedStock = await prisma.stock.delete({
                where: { id: StockId, hotelId },
            });

            return { Stock: deletedStock };
        });
    } catch (error) {
        throw throwAppropriateError(error);
    }
}
export function checkAdminRole(roles: UserRole[]) {
    if (
        !roles.includes(UserRole.admin) && !roles.includes(UserRole.stock_Manager) && !roles.includes(UserRole.reception_Manager)
    ) {
        throw new UnauthorizedError(
            "Sauf l'Admin peut faire cette action"
        );
    }
};