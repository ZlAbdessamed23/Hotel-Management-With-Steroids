import {
  AttendueType,
  Prisma,
  ReservationSource,
  UserGender,
} from "@prisma/client";

export type UpdateAttendueData = {
  fullName?: string;
  dateOfBirth?: Date;
  phoneNumber?: string;
  email?: string;
  identityCardNumber?: string;
  address?: string;
  nationality?: string;
  gender?: UserGender;
  type?: AttendueType;
  reservationSource?: ReservationSource;
};

export type AttendueResult = {
  Attendue: Prisma.AttendueGetPayload<{
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
  }>;
};
export type GetAttendueResult = {
  Attendue: Prisma.AttendueGetPayload<{
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
  }>;
};
