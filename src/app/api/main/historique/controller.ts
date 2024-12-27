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
      select : {
        fullName : true,
        starDate : true,
        endDate : true,
        gender : true,
        identityCardNumber : true,
        id : true,
        nationality : true,
        phoneNumber : true,
        createdAt : true,
    
      }
    });

    return { ClientsHistorique: ClientsHistorique };
  } catch (error) {
    throwAppropriateError(error);
  }
}

export function checkAdminReceptionManagerRole(roles: UserRole[]) {
  if (!roles.includes(UserRole.admin)) {
    throw new UnauthorizedError(
      "Sauf l'Administrateur peut faire cette action"
    );
  }
}
