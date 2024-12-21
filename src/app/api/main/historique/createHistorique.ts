import { throwAppropriateError } from "@/lib/error_handler/throwError";
import prisma from "@/lib/prisma/prismaClient";
import {
  AddClientsHistoriqueData,
  ClientHistorique,
  
} from "@/app/api/main/historique/types";

const HISTORIQUE_LIMIT = 150;

export async function addClientsHistorique(
  data: AddClientsHistoriqueData,
  hotelId: string
): Promise<ClientHistorique> {
  try {
    return await prisma.$transaction(async (prisma) => {
      // Count total records for this hotel
      const totalRecords = await prisma.clientsHistorique.count({
        where: { hotelId }
      });

      // If we're at or exceeding the limit, delete oldest records
      if (totalRecords >= HISTORIQUE_LIMIT) {
        const recordsToDelete = totalRecords - HISTORIQUE_LIMIT + 1; // +1 to make room for the new record
        const oldestRecords = await prisma.clientsHistorique.findMany({
          where: { hotelId },
          orderBy: { createdAt: 'asc' }, // Get oldest records first
          take: recordsToDelete,
          select: { id: true }
        });

        await prisma.clientsHistorique.deleteMany({
          where: {
            id: {
              in: oldestRecords.map(record => record.id)
            }
          }
        });
      }

      // Create the new record
      const createdClientsHistorique = await prisma.clientsHistorique.create({
        data: { ...data, hotelId }
      });

      return { ClientHistorique: createdClientsHistorique };
    });
  } catch (error) {
    throwAppropriateError(error);
  }
}
