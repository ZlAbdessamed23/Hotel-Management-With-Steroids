import { UnauthorizedError } from "@/lib/error_handler/customerErrors";
import { throwAppropriateError } from "@/lib/error_handler/throwError";
import prisma from "@/lib/prisma/prismaClient";
import { UserRole } from "@prisma/client";
import { ClientsHistorique } from "@/app/api/main/historique/types";
export async function getAllClientsHistorique(
  hotelId: string
): Promise<ClientsHistorique> {
  try {
    // Fetch all ClientsHistorique excluding sensitive fields
    const ClientsHistorique = await prisma.clientsHistorique.findMany({
      where: { hotelId: hotelId },
    });

    return { ClientsHistorique: ClientsHistorique };
  } catch (error) {
    throwAppropriateError(error);
  }
}

export function checkAdminRole(roles: UserRole[]) {
  if (!roles.includes(UserRole.admin)) {
    throw new UnauthorizedError(
      "Sauf l'Administrateur peut faire cette action"
    );
  }
}
