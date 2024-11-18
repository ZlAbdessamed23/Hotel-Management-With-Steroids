import { UserRole, RoomStatus, Prisma, ReservationState, UserGender, ClientOrigin } from "@prisma/client";
import {
  ClientCardResult,
  ClientReservationData,
  ClientWithReservationResult,
} from "./types";
import {
  ValidationError,
  NotFoundError,
} from "@/lib/error_handler/customerErrors";
import { throwAppropriateError } from "@/lib/error_handler/throwError";
import prisma from "@/lib/prisma/prismaClient";
import { updateClientCheckInStatistics } from "@/app/api/main/statistics/statistics";

export async function updateClientAndReservation(
  clientId: string,
  reservationId: string,
  hotelId: string,
  data: ClientReservationData
): Promise<ClientWithReservationResult> {
  try {
    return await prisma.$transaction(async (prisma) => {
      // Check if client and reservation exist
      const existingClient = await prisma.client.findUnique({
        where: { id: clientId },
        include: {
          reservations: {
            include: { room: true }, // Include room details
          },
        },
      });

      if (!existingClient || existingClient.hotelId !== hotelId) {
        throw new NotFoundError(`Client non trouvé`);
      }

      const existingReservation = existingClient.reservations.find(
        (r) => r.id === reservationId
      );
      if (!existingReservation) {
        throw new NotFoundError(`Reservation non trouvée`);
      }
      const isStatusChangingToValid =
        existingReservation.state !== ReservationState.valide &&
        data.status === ReservationState.valide;
      const clientUpdateData: Prisma.ClientUpdateInput = {
        fullName: data.fullName,
        dateOfBirth: data.dateOfBirth,
        phoneNumber: data.phoneNumber,
        email: data.email,
        kidsNumber: data.kidsNumber,
        membersNumber: data.membersNumber,
        identityCardNumber: data.identityCardNumber,
        address: data.address,
        nationality: data.nationality,
        gender: data.gender,
      };

      const reservationUpdateData: Prisma.ReservationUpdateInput = {
        startDate: data.startDate,
        endDate: data.endDate,
        totalDays: data.totalDays,
        state: data.status,
        source: data.source,
        discoveryChannel: data.discoveryChannel,
      };

      // Remove undefined fields
      Object.keys(clientUpdateData).forEach((key) => {
        if (
          clientUpdateData[key as keyof Prisma.ClientUpdateInput] === undefined
        ) {
          delete clientUpdateData[key as keyof Prisma.ClientUpdateInput];
        }
      });

      Object.keys(reservationUpdateData).forEach((key) => {
        if (
          reservationUpdateData[key as keyof Prisma.ReservationUpdateInput] ===
          undefined
        ) {
          delete reservationUpdateData[
            key as keyof Prisma.ReservationUpdateInput
          ];
        }
      });

      // Check if room change is requested and if it's different from the current room
      const isRoomChangeRequested =
        data.roomNumber !== undefined || data.roomType !== undefined;
      const isSameRoom =
        (!data.roomNumber ||
          data.roomNumber === existingReservation.room.number) &&
        (!data.roomType || data.roomType === existingReservation.room.type);

      if (isRoomChangeRequested && !isSameRoom) {
        const newRoomType = data.roomType || existingReservation.room.type;
        const newRoomNumber =
          data.roomNumber || existingReservation.room.number;

        const newRoom = await prisma.room.findFirst({
          where: {
            hotelId,
            number: newRoomNumber,
            type: newRoomType,
            status: RoomStatus.disponible,
          },
        });

        if (!newRoom) {
          throw new NotFoundError(`Chambre occupée`);
        }

        // Update old room status
        await prisma.room.update({
          where: { id: existingReservation.roomId },
          data: { status: RoomStatus.disponible },
        });

        // Update new room status
        await prisma.room.update({
          where: { id: newRoom.id },
          data: { status: RoomStatus.reservee },
        });

        reservationUpdateData.roomNumber = newRoomNumber;
        reservationUpdateData.roomType = newRoomType;
        reservationUpdateData.room = { connect: { id: newRoom.id } };
      }

      // Update client and reservation
      const updatedClient = await prisma.client.update({
        where: { id: clientId },
        data: {
          ...clientUpdateData,
          reservations: {
            update: {
              where: { id: reservationId },
              data: reservationUpdateData,
            },
          },
        },
        include: { reservations: true },
      });
       if (isStatusChangingToValid) {
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
    throwAppropriateError(error);
  }
}
///////////////// get client with reservation with member ////////////////
export async function getClientWithReservations(
  clientId: string,
  reservationId: string,
  hotelId: string
): Promise<ClientCardResult> {
  try {
    const client = await prisma.client.findUnique({
      where: {
        id: clientId,
        hotelId: hotelId,
      },
      include: {
        reservations: {
          where: { id: reservationId },
          include: {
            member: true,
          },
        },
      },
    });

    if (!client) {
      throw new Error("Client non trouvé");
    }

    return { client };
  } catch (error) {
    throwAppropriateError(error);
  }
}
// The role-checking functions remain the same
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
