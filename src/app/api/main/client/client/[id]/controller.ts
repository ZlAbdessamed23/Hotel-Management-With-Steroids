import {
  ConflictError,
  NotFoundError,
  ValidationError,
} from "@/lib/error_handler/customerErrors";
import { throwAppropriateError } from "@/lib/error_handler/throwError";
import prisma from "@/lib/prisma/prismaClient";
import {
  Client,
  UserRole,
  UserGender,
  Prisma,
  ClientOrigin,
} from "@prisma/client";
import {
  UpdateClientData,
  ClientResult,
} from "@/app/api/main/client/client/[id]/types";
import { updateClientCheckInStatistics } from "@/app/api/main/statistics/statistics";

export async function getClientById(
  clientId: string,
  hotelId: string
): Promise<ClientResult> {
  try {
    const client = await prisma.client.findFirst({
      where: {
        id: clientId,
        hotelId: hotelId,
      },
    });

    if (!client) {
      throw new NotFoundError("Client non trouvé");
    }

    return { client };
  } catch (error) {
    throw throwAppropriateError(error);
  }
}

export async function deleteClientById(
  clientId: string,
  hotelId: string
): Promise<ClientResult> {
  try {
    return await prisma.$transaction(async (prisma) => {
      // First, get the client's reservations to find associated rooms
      const client = await prisma.client.findUnique({
        where: {
          id: clientId,
          hotelId: hotelId,
        },
        include: {
          reservations: {
            include: {
              room: true,
            },
          },
        },
      });

      if (!client) {
        throw new Error("Client non trouvée");
      }

      // Update all rooms associated with client's reservations to 'disponible'
      for (const reservation of client.reservations) {
        if (reservation.room) {
          await prisma.room.update({
            where: {
              id: reservation.room.id,
            },
            data: {
              status: "disponible",
            },
          });
        }
      }

      const deletedClient = await prisma.client.delete({
        where: {
          id: clientId,
          hotelId: hotelId,
        },
      });

      return { client: deletedClient };
    });
  } catch (error) {
    throw throwAppropriateError(error);
  }
}

export async function updateClient(
  clientId: string,
  hotelId: string,
  data: UpdateClientData
): Promise<ClientResult> {
  try {
    return await prisma.$transaction(async (prisma) => {
      // First, fetch the existing client with their reservations
      const existingClient = await prisma.client.findUnique({
        where: {
          id: clientId,
          hotelId,
        },
        include: {
          reservations: {
            where: {
              state: {
                in: ["valide"], // Add any other valid states you consider
              },
            },
          },
        },
      });

      if (!existingClient) {
        throw new Error("Client non trouvée");
      }

      const updateData: Prisma.ClientUpdateInput = {
        fullName: data.fullName,
        dateOfBirth: data.dateOfBirth,
        phoneNumber: data.phoneNumber,
        email: data.email,
        kidsNumber: data.kidsNumber,
        membersNumber: data.membersNumber,
        identityCardNumber: data.identityCardNumber,
        address: data.address,
        nationality: data.nationality,
        gender: data.gender as UserGender,
      };

      // Remove undefined fields
      Object.keys(updateData).forEach((key) => {
        if (
          key in updateData &&
          updateData[key as keyof Prisma.ClientUpdateInput] === undefined
        ) {
          delete updateData[key as keyof Prisma.ClientUpdateInput];
        }
      });

      // Update client
      const updatedClient = await prisma.client.update({
        where: { id: clientId },
        data: updateData,
      });

      // Check if we need to update statistics (if there are valid reservations and gender changed)
      const hasValidReservations = existingClient.reservations.length > 0;
      const genderChanged =
        data.gender !== undefined && data.gender !== existingClient.gender;
      const originChanged =
        data.clientOrigin !== undefined &&
        data.clientOrigin !== existingClient.clientOrigin;

      if (hasValidReservations && (genderChanged || originChanged)) {
        await updateClientCheckInStatistics(
          hotelId,
          existingClient.gender,
          data.gender as UserGender,
          null,
          existingClient.clientOrigin,
          data.clientOrigin as ClientOrigin,
          0,
          prisma,
          false
        );
      }

      return { client: updatedClient };
    });
  } catch (error) {
    throw throwAppropriateError(error);
  }
}

export function checkReceptionistAdminRole(roles: UserRole[]) {
  if (
    !roles.includes(UserRole.receptionist) &&
    !roles.includes(UserRole.admin) &&
    !roles.includes(UserRole.reception_Manager)
  ) {
    throw new ValidationError(
      "Sauf le réceptiontist, le réceptionist manager et l'administrateur peut faire cette action"
    );
  }
}

export function checkReceptionistRole(roles: UserRole[]) {
  if (
    !roles.includes(UserRole.receptionist) &&
    !roles.includes(UserRole.reception_Manager)
  ) {
    throw new ValidationError(
      "Sauf le réceptiontist et le réceptionist manager peut faire cette action"
    );
  }
}
