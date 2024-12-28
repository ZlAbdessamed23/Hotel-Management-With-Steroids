import {
  ConflictError,
  NotFoundError,
  ValidationError,
} from "@/lib/error_handler/customerErrors";
import { throwAppropriateError } from "@/lib/error_handler/throwError";
import prisma from "@/lib/prisma/prismaClient";
import { Prisma,  RoomStatus,  UserRole } from "@prisma/client";
import { RoomResult, UpdateRoomData,getRoomResult } from "@/app/api/main/room/[id]/types";
import { updateRoomStatistics } from "@/app/api/main/statistics/statistics";

export async function getRoomById(
  roomId: string,
  hotelId: string
): Promise<getRoomResult> {
  try {
    const room = await prisma.room.findFirst({
      where: {
        hotelId,
        reservation: {
          id: roomId
        }
      },
      select : {
        id : true,
        capacity : true,
        description : true,
        floorNumber : true,
        number : true,
        outOfServiceDescription : true,
        price : true,
        status : true,
        type : true,
        
      
        reservation: {
          select: {
            id:true,
            startDate: true,
            endDate: true,
            client: {
              select: {
                id: true,
                fullName: true,
              },
            },
          },
        },
      }
    });

    if (!room) {
      throw new NotFoundError("la chambre spécifié n'est pas trouvée");
    }

    return { room };
  } catch (error) {
    throwAppropriateError(error);
  }
}

//////////////////////////////////// delete room by id //////////////////////////////////////
export async function deleteRoomById(
  roomId: string,
  hotelId: string
): Promise<RoomResult> {
  try {
    return await prisma.$transaction(async (prisma) => {
      const room = await prisma.room.findUnique({
        where: {
          id: roomId,
          hotelId: hotelId,
        },
        select : {
          id : true,
          capacity : true,
          description : true,
          floorNumber : true,
          number : true,
          outOfServiceDescription : true,
          price : true,
          status : true,
          type : true,
          
        
          reservation: {
            select: {
              id:true,
              startDate: true,
              endDate: true,
              client: {
                select: {
                  id: true,
                  fullName: true,
                },
              },
            },
          },
        }
      });

      if (!room) {
        throw new NotFoundError(
          "Room not found or does not belong to this hotel"
        );
      }

      if (room.reservation) {
        throw new ConflictError(
          "Impossible de supprimer une chambre avec une réservation active"
        );
      }

      const deletedRoom = await prisma.room.delete({
        where: {
          id: roomId,
          hotelId: hotelId,
        },
      });

      await updateRoomStatistics(hotelId, "remove", prisma);

      return { room: deletedRoom };
    });
  } catch (error) {
    throwAppropriateError(error);
  }
}

/////////////////////////////// update Room /////////////////////////////////
export async function updateRoom(
  roomId: string,
  hotelId: string,
  data: UpdateRoomData
): Promise<RoomResult> {
  try {
    return await prisma.$transaction(async (prisma) => {
      // Combine room fetch and number conflict check
      const room = await prisma.room.findUnique({
        where: { id: roomId },
        select: { 
          status: true, 
          hotelId: true 
        },
      });

      // Check if room exists and belongs to the hotel
      if (!room || room.hotelId !== hotelId) {
        throw new NotFoundError(
          `la chambre spécifié n'est pas trouvée`
        );
      }

      // Prevent updates to reserved rooms
      if (room.status === RoomStatus.reservee) {
        throw new ConflictError("Impossible de modifier une chambre réservée");
      }
      const numberConflict = data.number
        ? await prisma.room.findFirst({
            where: {
              number: data.number,
              hotelId,
              NOT: { id: roomId },
            },
            select: { id: true },
          })
        : null;

      if (numberConflict) {
        throw new ConflictError(`Une chambre avec ce nombre existe déja`);
      }

      const updateData: Prisma.RoomUpdateInput = {
        type: data.type,
        number: data.number,
        floorNumber: data.floorNumber,
        description: data.description,
        price:
          data.price !== undefined ? new Prisma.Decimal(data.price) : undefined,
        capacity: data.capacity,
        status: data.status,

        outOfServiceDescription: data.outOfServiceDescription,
      };

      // Remove undefined fields
      Object.keys(updateData).forEach((key) => {
        if (
          key in updateData &&
          updateData[key as keyof Prisma.RoomUpdateInput] === undefined
        ) {
          delete updateData[key as keyof Prisma.RoomUpdateInput];
        }
      });

      const updatedRoom = await prisma.room.update({
        where: { id: roomId },
        data: updateData,
      });
      

      return { room: updatedRoom };
    });
  } catch (error) {
    throw throwAppropriateError(error);
  }
}
//////////////////////////////// functions ////////////////////////////////////
export function checkReceptionistReceptionManagerRole(roles: UserRole[]) {
  if (
    !roles.includes(UserRole.receptionist) &&
    !roles.includes(UserRole.reception_Manager)
  ) {
    throw new ValidationError(
      "Sauf le receptionist et le receptionist manager peut faire cette action"
    );
  }
}
export function checkReceptionistReceptionManagerAdminRole(roles: UserRole[]) {
  if (
    !roles.includes(UserRole.receptionist) &&
    !roles.includes(UserRole.reception_Manager) &&
    !roles.includes(UserRole.admin)
  ) {
    throw new ValidationError(
      "Sauf le receptionist et le receptionist manager et l'administrateur peut faire cette action"
    );
  }
}
