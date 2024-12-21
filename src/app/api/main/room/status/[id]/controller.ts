import { Prisma, PrismaClient, RoomStatus, UserRole } from "@prisma/client";
import { RoomResult, UpdateRoomStateData } from "@/app/api/main/room/status/[id]/types";
import {
  ConflictError,
  NotFoundError,
  ValidationError,
} from "@/lib/error_handler/customerErrors";
import { throwAppropriateError } from "@/lib/error_handler/throwError";
import prisma from "@/lib/prisma/prismaClient";

export async function updateRoomState(
  data: UpdateRoomStateData,
  roomId: string,
  hotelId: string
): Promise<RoomResult> {
  try {
    return await prisma.$transaction(async (prisma) => {
      const room = await prisma.room.findUnique({
        where: { id: roomId },
        select: { status: true, hotelId: true },
      });
      
      if (!room || room.hotelId !== hotelId) {
        throw new NotFoundError(
          `la chambre spécifié n'est pas trouvée`
        );
      };
      if(room.status === RoomStatus.reservee){
        throw new ConflictError(
          "chambre déja réservée"
        );
      }

      if (data.isFixed && room.status==RoomStatus.disponible) {
        throw new ConflictError(
          "la chambre est déja disponible"
        );
      };

      if (!data.isFixed && room.status!==RoomStatus.disponible) {
        throw new ConflictError(
          "la chambre est déja en panne ou hors-service"

        );
      };

      const updateData: Prisma.RoomUpdateInput = {
        status: data.isFixed ? RoomStatus.disponible : RoomStatus.en_panne,
        
        outOfServiceDescription: data.isFixed
          ? null
          : data.outOfServiceDescription,
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

      const updatedRoom =await
        prisma.room.update({
          where: { id: roomId },
          data: updateData,
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
            
          
            
          }
        })
        
   

      return { room: updatedRoom };
    });
  } catch (error) {
    throw throwAppropriateError(error);
  }
}

/////////////////////////////// function ////////////////////////////////////

export function checkReceptionistReceptionManagerRole(roles: UserRole[]) {
  if (!roles.includes(UserRole.receptionist) && !roles.includes(UserRole.reception_Manager) ) {
    throw new ValidationError("Sauf le receptionist et le reception manager peut faire cette action");
  }
}
