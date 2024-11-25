import { Prisma } from "@prisma/client";

export type AddEventMemberData = {
  identityCardNumber?: string;
  phoneNumber?: string;
  email?: string;

  reservationId: string;
  eventId: string;
};

export const requiredEventMemberFields: (keyof AddEventMemberData)[] = [
  "reservationId",
];

export type EventMemberResult = {
  EventMember: Prisma.AttendueGetPayload<{select : {
    fullName :true,
    nationality : true,
    address : true,
     dateOfBirth : true,
     email : true,
     id : true,
     gender : true,
     eventId : true,
     identityCardNumber : true,
     phoneNumber : true,
     type : true,
     reservationSource : true,
     
  }}>;
};
