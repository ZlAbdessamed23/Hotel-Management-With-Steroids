import { Prisma } from "@prisma/client";

export type EventAttendeeResult = {
  Attendues: Prisma.AttendueGetPayload<{select : {
    address : true,
    email : true,
    phoneNumber : true,
    id : true,
    identityCardNumber : true,
    type : true,
    dateOfBirth : true,
    gender : true,
    fullName : true,
    eventId : true,
    reservationId : true,
    reservationSource : true,
    nationality : true,

  }}>[];
};
