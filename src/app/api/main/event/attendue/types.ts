import {
  Prisma,
  UserGender,
  ReservationSource,
  AttendueType,
} from "@prisma/client";

export type AddAttendueData = {
  fullName: string;
  dateOfBirth: Date;
  phoneNumber: string;
  email?: string;
  identityCardNumber: string;
  type: AttendueType;
  address: string;
  nationality: string;
  gender: UserGender;
  reservationSource: ReservationSource;
  eventId: string;
};

export const requiredAttendueFields: (keyof AddAttendueData)[] = [
  "fullName",
  "dateOfBirth",
  "phoneNumber",
  "identityCardNumber",
  "address",
  "type",
  "nationality",
  "gender",
  "reservationSource",
 
  "eventId",
];

export type AttendueResult = {
  Attendue: Prisma.AttendueGetPayload<{}>;
};

export type AttenduesResult = {
  Attendues: Prisma.AttendueGetPayload<{}>[];
};
