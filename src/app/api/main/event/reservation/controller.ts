import prisma from "@/lib/prisma/prismaClient";
import {
  NotFoundError,
  ValidationError,
  ConflictError,
} from "@/lib/error_handler/customerErrors";
import { throwAppropriateError } from "@/lib/error_handler/throwError";
import {
  UserRole,
  ReservationState,
  ReservationSource,
  RoomStatus,
  
} from "@prisma/client";
import {
  CreateReservationWithAttendeeData,
  ReservationWithAttendeeResult,
} from "@/app/api/main/event/reservation/types";

// Controller functions
export async function createReservationWithAttendee(
  data: CreateReservationWithAttendeeData,
  employeeId: string,
  hotelId: string
): Promise<ReservationWithAttendeeResult> {
  try {
    return await prisma.$transaction(async (prisma) => {
      const [room, attendee] = await Promise.all([
        prisma.room.findFirst({
          where: {
            hotelId: hotelId,
            number: data.roomNumber,
            type: data.roomType,
          },
        }),
        prisma.attendue.findFirst({
          where: { id: data.attendueId, eventId: data.eventId },
        }),
        
      ]);

      if (!room) {
        throw new NotFoundError("Chambre non trouvée"); 
      }
      if (room.status !== RoomStatus.disponible) {
        throw new ConflictError("la chambre est déja réservée ou hors service");
      }

      if (!attendee) {
        throw new NotFoundError("Membre non touvé");
      }

      
      const totalDays = Math.ceil((new Date(data.endDate).getTime() - new Date(data.startDate).getTime()) / (1000 * 60 * 60 * 24));
      if (totalDays < 0) {
        throw new ValidationError("La durée de réservation est invalide. La date de fin doit être supérieure à la date de début.");
      }
      const unitPrice = room.price.toNumber();
      const totalPrice = totalDays * unitPrice;

      const createdReservation = await prisma.reservation.create({
        data: {
          roomNumber: data.roomNumber,
          roomType: data.roomType,
          startDate: data.startDate,
          endDate: data.endDate,
          totalDays: totalDays,
          totalPrice,
          unitPrice, // Added the required unitPrice field
          state: data.state ,
          source: data.source ,
          currentOccupancy: data.currentOccupancy || 1,
          discoveryChannel: data.discoveryChannel,
          hotel: { connect: { id: hotelId } },
          employee: { connect: { id: employeeId } },
          room: { connect: { id: room.id } },
          attendues: { connect: { id: data.attendueId } },
        },
        select : {
      id : true,
      startDate : true,
      endDate : true,
      unitPrice : true,
       totalDays : true,
       totalPrice : true,
       currentOccupancy : true,
       discoveryChannel : true,
       roomNumber : true,
       roomType : true,
       source : true,
       state : true , 
       attendues : {select : {
        address : true,
        id : true,
        phoneNumber : true,
        email : true,
        eventId : true,
        dateOfBirth : true,
        identityCardNumber : true,
        fullName : true,
        gender : true,
        nationality : true,
        type : true,
        reservationSource : true,
       }}
       
  }
      });

      await prisma.room.update({
        where: { id: room.id },
        data: { status: RoomStatus.reservee },
      });

      return {
        reservation: createdReservation,
      };
    });
  } catch (error) {
    throw throwAppropriateError(error);
  }
}

// Role check functions remain the same
export function checkReceptionManagerReceptionistAdminRole(roles: UserRole[]) {
  if (
    !roles.includes(UserRole.receptionist) &&
    !roles.includes(UserRole.reception_Manager) &&
    !roles.includes(UserRole.admin)
  ) {
    throw new ValidationError(
      "Sauf le receptionist , le receptionist manager et l'Administrateur peut faire cette action"
    );
  }
}

export function checkReceptionManagerReceptionistRole(roles: UserRole[]) {
  if (
    !roles.includes(UserRole.receptionist) &&
    !roles.includes(UserRole.reception_Manager)
  ) {
    throw new ValidationError(
      "Sauf le receptionist et le receptionist manager peut faire cette action"
    );
  }
}