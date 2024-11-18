import { throwAppropriateError } from "@/lib/error_handler/throwError";
import prisma from "@/lib/prisma/prismaClient";
import {
  AddClientsHistoriqueData,
  ClientHistorique,
  ClientsHistorique,
} from "@/app/api/main/historique/types";

const HISTORIQUE_LIMIT = 150;

export async function addClientsHistorique(
  data: AddClientsHistoriqueData,
  hotelId: string
): Promise<ClientHistorique> {
  try {
    return await prisma.$transaction(async (prisma) => {
      // Get IDs of excess records in a single query
      const excessRecords = await prisma.clientsHistorique.findMany({
        where: { hotelId },
        orderBy: { createdAt: "asc" },
        take: -HISTORIQUE_LIMIT,
        select: { id: true },
      });

      // If we have excess records, delete them
      if (excessRecords.length > 0) {
        await prisma.clientsHistorique.deleteMany({
          where: {
            id: {
              in: excessRecords.map((record) => record.id),
            },
          },
        });
      }

      // Create the new record
      const createdClientsHistorique = await prisma.clientsHistorique.create({
        data: { ...data, hotelId },
      });

      return { ClientHistorique: createdClientsHistorique };
    });
  } catch (error) {
    throwAppropriateError(error);
  }
}
