import { Room } from "@prisma/client";
import prisma from "@/lib/prisma/prismaClient"; // Adjust the import path as needed
import { AddRoomData, RoomResult, RoomsResult } from "./types";
import {
  ValidationError,
  ConflictError,
  LimitExceededError,
} from "@/lib/error_handler/customerErrors"; // Adjust as needed
import { UserRole } from "@prisma/client";
import { throwAppropriateError } from "@/lib/error_handler/throwError";
import { updateRoomStatistics } from "@/app/api/main/statistics/statistics";
export async function addRoom(
  data: AddRoomData,
  hotelId: string
): Promise<RoomResult> {
  try {
    return await prisma.$transaction(async (prisma) => {
      const [hotel, roomCount, existingRoom] = await Promise.all([
        prisma.hotel.findUnique({
          where: { id: hotelId },
          include: {
            subscription: {
              include: {
                plan: true,
              },
            },
          },
        }),
        prisma.room.count({ where: { hotelId } }),
        prisma.room.findFirst({
          where: { number: data.number, hotelId: hotelId },
        }),
      ]);

      if (!hotel) throw new ValidationError("Hotel non trouvé");
      if (!hotel.subscription?.plan)
        throw new ValidationError("Hotel n'a pas d'abonnement actif");

      if (roomCount >= hotel.subscription.plan.maxRooms) {
        throw new LimitExceededError(
          "Le nombre Maximum des chambres pour ce plan est déja atteint"
        );
      }

      if (existingRoom) {
        throw new ConflictError("Une chambre avec ce nombre existe déja");
      }

      const createdRoom = await prisma.room.create({
        data: { ...data, hotelId },
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
      
      await updateRoomStatistics(hotelId, "add", prisma);

      return { room: createdRoom };
    });
  } catch (error) {
    throwAppropriateError(error);
  }
}

///////////////////  get all rooms for both receptionist and admin /////////////////////////////
export async function getAllRooms(hotelId: string): Promise<RoomsResult> {
  try {
    const rooms = await prisma.room.findMany({
      where: { hotelId: hotelId },
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

    return { rooms };
  } catch (error) {
    throwAppropriateError(error);
  }
}

/////////////////////////////// function /////////////////////////////////////////
export function checkReceptionistAdminRole(roles: UserRole[]) {
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

export function checkReceptionistRole(roles: UserRole[]) {
  if (
    !roles.includes(UserRole.receptionist) &&
    !roles.includes(UserRole.reception_Manager)
  ) {
    throw new ValidationError(
      "Sauf le receptionist et le receptionist manager peut faire cette action"
    );
  }
}
