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
  Attendue: Prisma.AttendueGetPayload<{}>;
};
export type GetAttendueResult = {
  Attendue: Prisma.AttendueGetPayload<{
    include: { reservation: { include: { attendues: true } } };
  }>;
};
