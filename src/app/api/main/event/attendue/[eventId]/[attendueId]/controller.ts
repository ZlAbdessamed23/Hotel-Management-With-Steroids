import {
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from "@/lib/error_handler/customerErrors";
import { throwAppropriateError } from "@/lib/error_handler/throwError";
import { Prisma, UserRole } from "@prisma/client";
import {
  UpdateAttendueData,
  AttendueResult,
  GetAttendueResult,
} from "@/app/api/main/event/attendue/[eventId]/[attendueId]/types";
import prisma from "@/lib/prisma/prismaClient";

// Get Attendue
export async function getAttendueById(
  eventId: string,
  attendueId: string,
  hotelId: string
): Promise<GetAttendueResult> {
  try {
   const existingAttendue = await prisma.attendue.findUnique({
     where: { id: attendueId, eventId: eventId },
     select: {
      address: true,
      email: true,
      phoneNumber: true,
      id: true,
      identityCardNumber: true,
      type: true,
      dateOfBirth: true,
      gender: true,
      fullName: true,
      eventId: true,
      reservationId: true,
      reservationSource: true,
      nationality: true,
      reservation: {
        select: {
          id: true,
          startDate: true,
          endDate: true,
          unitPrice: true,
          totalDays: true,
          totalPrice: true,
          currentOccupancy: true,
          discoveryChannel: true,
          roomNumber: true,
          roomType: true,
          source: true,
          state: true,
          attendues: {
            select: {
              address: true,
              email: true,
              phoneNumber: true,
              id: true,
              identityCardNumber: true,
              type: true,
              dateOfBirth: true,
              gender: true,
              fullName: true,
              eventId: true,
              reservationId: true,
              reservationSource: true,
              nationality: true,
            }
          }

        }
      }

    }
   });

    if (!existingAttendue ) {
      throw new NotFoundError(
        `Attendue non trouvé`
      );
    }

    return { Attendue: existingAttendue };
  } catch (error) {
    throw throwAppropriateError(error);
  }
}

// Delete Attendue
export async function deleteAttendue(
  eventId: string,
  attendueId: string,
  hotelId: string
): Promise<AttendueResult> {
  try {
    return await prisma.$transaction(async (prisma) => {
      
      const deletedAttendue = await prisma.attendue.delete({
        where: { id: attendueId },
        select: {
          address: true,
          email: true,
          phoneNumber: true,
          id: true,
          identityCardNumber: true,
          type: true,
          dateOfBirth: true,
          gender: true,
          fullName: true,
          eventId: true,
          reservationId: true,
          reservationSource: true,
          nationality: true,
         
    
        }
      });

      return { Attendue: deletedAttendue };
    });
  } catch (error) {
    throw throwAppropriateError(error);
  }
}

// Update Attendue
export async function updateAttendue(
  eventId: string,
  attendueId: string,
  hotelId: string,
  data: UpdateAttendueData
): Promise<AttendueResult> {
  try {
    return await prisma.$transaction(async (prisma) => {
      

      const updateData: Prisma.AttendueUpdateInput = {
        fullName: data.fullName,
        dateOfBirth: data.dateOfBirth,
        phoneNumber: data.phoneNumber,
        email: data.email,
        identityCardNumber: data.identityCardNumber,
        address: data.address,
        nationality: data.nationality,
        gender: data.gender,
        type: data.type,
        reservationSource: data.reservationSource,
      };

      Object.keys(updateData).forEach((key) => {
        if (
          key in updateData &&
          updateData[key as keyof Prisma.AttendueUpdateInput] === undefined
        ) {
          delete updateData[key as keyof Prisma.AttendueUpdateInput];
        }
      });

      const updatedAttendue = await prisma.attendue.update({
        where: { id: attendueId },
        data: updateData,
        select: {
          address: true,
          email: true,
          phoneNumber: true,
          id: true,
          identityCardNumber: true,
          type: true,
          dateOfBirth: true,
          gender: true,
          fullName: true,
          eventId: true,
          reservationId: true,
          reservationSource: true,
          nationality: true,
         
    
        }
      });

      return { Attendue: updatedAttendue };
    });
  } catch (error) {
    throw throwAppropriateError(error);
  }
}

// Role check functions (you may need to adjust these based on your specific requirements)
export function checkReceptionManagerReceptionistAdminRole(roles: UserRole[]) {
  if (
    !roles.includes(UserRole.admin) &&
    !roles.includes(UserRole.reception_Manager) &&
    !roles.includes(UserRole.receptionist)
  ) {
    throw new UnauthorizedError(
      "Sauf le réceptiontist, le réceptionist manager et l'administrateur peut faire cette action"
    );
  }
}
export function checkReceptionManagerReceptionistRole(roles: UserRole[]) {
  if (
    !roles.includes(UserRole.reception_Manager) &&
    !roles.includes(UserRole.receptionist)
  ) {
    throw new UnauthorizedError(
      "Sauf le réceptiontist et le réceptionist manager peut faire cette action"
    );
  }
}
