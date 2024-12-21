import { PendingClientResults } from "@/app/api/main/client/pendingClients/types";
import { UnauthorizedError } from "@/lib/error_handler/customerErrors";
import { throwAppropriateError } from "@/lib/error_handler/throwError";
import prisma from "@/lib/prisma/prismaClient";
import { UserRole } from "@prisma/client";

export async function getPendingClientResults(
  hotelId: string
): Promise<PendingClientResults> {
  try {
    const clients = await prisma.client.findMany({
      where: { hotelId: hotelId },
      select: {
        fullName: true,
        address: true,
        email: true,
        phoneNumber: true,
        id: true,
        identityCardNumber: true,
        gender: true,
        dateOfBirth: true,
        clientOrigin: true,
        kidsNumber: true,
        nationality: true,
        membersNumber: true,
        createdAt: true,
        pendingReservation: {
          select: {
            id: true,
            roomNumber: true,
            roomType: true,
            createdAt: true,
            totalDays: true,
            totalPrice: true,
            currentOccupancy: true,
            discoveryChannel: true,
            source: true,
            state: true,
            startDate: true,
            endDate: true,
            unitPrice: true,
          }
        }
      }
    });

    // Filter out clients with no pending reservations
    const filteredClients = clients.filter(client => 
      client.pendingReservation && client.pendingReservation.length > 0
    );
      
    return { pendingClients: filteredClients };
  } catch (error) {
    throwAppropriateError(error);
  }
}
  export function checkReceptionistReceptionManagerAdminRole(roles: UserRole[]) {
    if (
      !roles.includes(UserRole.receptionist) &&
      !roles.includes(UserRole.admin) &&
      !roles.includes(UserRole.reception_Manager)
    ) {
      throw new UnauthorizedError(
        "Sauf le réceptiontist, le réceptionist manager et l'administrateur peut faire cette action"
      );
    }
  }