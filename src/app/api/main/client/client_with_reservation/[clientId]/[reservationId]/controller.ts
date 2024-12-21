import { UserRole, RoomStatus, Prisma, ReservationState, UserGender, ClientOrigin } from "@prisma/client";
import {
  ClientCardResult,
  ClientReservationData,
  ClientWithReservationResult,
} from "@/app/api/main/client/client_with_reservation/[clientId]/[reservationId]/types";
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
      // Check if client and reservation exist with optimized query
      const existingClient = await prisma.client.findUnique({
        where: { id: clientId },
        include: {
          reservations: {
            where: { id: reservationId },
            include: { room: true },
          },
        },
      });

      if (!existingClient || existingClient.hotelId !== hotelId) {
        throw new NotFoundError(`Client non trouvé`);
      }

      const existingReservation = existingClient.reservations[0];
      if (!existingReservation) {
        throw new NotFoundError(`Reservation non trouvée`);
      }

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

      // Handle date changes and total days calculation
      let newStartDate = data.startDate || existingReservation.startDate;
      let newEndDate = data.endDate || existingReservation.endDate;
      let newTotalDays: number | undefined;
      let newTotalPrice: number | undefined;
      let newUnitPrice: number | undefined;

      // Calculate new total days if dates changed
      if (data.startDate || data.endDate) {
        newTotalDays = Math.ceil(
          (new Date(newEndDate).getTime() - new Date(newStartDate).getTime()) /
            (1000 * 60 * 60 * 24)
        );
      }

      // Check if room change is requested and if it's different from the current room
      const isRoomChangeRequested = data.roomNumber !== undefined || data.roomType !== undefined;
      const isSameRoom =
        (!data.roomNumber || data.roomNumber === existingReservation.room.number) &&
        (!data.roomType || data.roomType === existingReservation.room.type);

      let newRoom ;

      if (isRoomChangeRequested && !isSameRoom) {
        const newRoomType = data.roomType || existingReservation.room.type;
        const newRoomNumber = data.roomNumber || existingReservation.room.number;

        newRoom = await prisma.room.findFirst({
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

        // Get new unit price from the new room
        newUnitPrice = newRoom.price.toNumber();
      }

      // Calculate total price based on changes
      if (newTotalDays || newUnitPrice) {
        // If we have a new room, use its price, otherwise use existing room's price
        const finalUnitPrice = newUnitPrice || existingReservation.unitPrice;
        // If we have new total days, use that, otherwise use existing total days
        const finalTotalDays = newTotalDays || existingReservation.totalDays;
        
        newTotalPrice = finalUnitPrice * finalTotalDays;
      }

      const reservationUpdateData: Prisma.ReservationUpdateInput = {
        startDate: data.startDate,
        endDate: data.endDate,
        totalDays: newTotalDays,
        state: data.status,
        source: data.source,
        discoveryChannel: data.discoveryChannel,
        totalPrice: newTotalPrice,
        unitPrice: newUnitPrice,
      };

      if (newRoom) {
        reservationUpdateData.roomNumber = newRoom.number;
        reservationUpdateData.roomType = newRoom.type;
        reservationUpdateData.room = { connect: { id: newRoom.id } };
      }

      // Remove undefined fields
      Object.keys(clientUpdateData).forEach((key) => {
        if (clientUpdateData[key as keyof Prisma.ClientUpdateInput] === undefined) {
          delete clientUpdateData[key as keyof Prisma.ClientUpdateInput];
        }
      });

      Object.keys(reservationUpdateData).forEach((key) => {
        if (reservationUpdateData[key as keyof Prisma.ReservationUpdateInput] === undefined) {
          delete reservationUpdateData[key as keyof Prisma.ReservationUpdateInput];
        }
      });

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
          hotelId: true,
          createdAt: true,
          reservations: {
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
              unitPrice: true
            }
          }
        }
      });

      await updateClientCheckInStatistics(
        hotelId,
        existingClient.gender,
        data.gender as UserGender,
        null,
        existingClient.clientOrigin,
        data.clientOrigin as ClientOrigin,
        existingReservation.totalPrice,
        newTotalPrice  || existingReservation.totalPrice ,
        prisma,
        false
      );

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
        hotelId: true,
        createdAt: true,
        reservations: {
          where: {
            id: reservationId
          },
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
            member: {
              select: {
                address: true,
                id: true,
                email: true,
                phoneNumber: true,
                dateOfBirth: true,
                fullName: true,
                identityCardNumber: true,
                nationality: true,
                gender: true,
              }
            }
          }
        }
      }
    });

    if (!client) {
      throw new NotFoundError("Client non trouvé");
    }

   

    return { client };
  } catch (error) {
    throwAppropriateError(error);
  }
}
// The role-checking functions remain the same
export function checkReceptionistReceptionManagerRole(roles: UserRole[]) {
  if (
    !roles.includes(UserRole.receptionist) &&
    !roles.includes(UserRole.reception_Manager)
  ) {
    throw new ValidationError(
      "Sauf le réceptiontist et le réceptionist manager peut faire cette action"
    );
  }
}

export function checkReceptionistReceptionManagerAdminRole(roles: UserRole[]) {
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
