import { Prisma, UserGender } from "@prisma/client";

export type AddMemberData = {
  fullName: string;
  dateOfBirth: Date;
  phoneNumber: string;
  email?: string;
  identityCardNumber: string;
  address: string;
  nationality?: string;
  gender: UserGender;
  reservationId: string;
};

export const requiredMemberFields: (keyof AddMemberData)[] = [
  "fullName",
  "dateOfBirth",
  "phoneNumber",

  "identityCardNumber",
  "address",

  "gender",
  "reservationId",
];
export type MemberResult = {
  member: Prisma.MemberGetPayload<{ select : {
    address : true,
    id : true , 
    email : true,
    phoneNumber : true,
    dateOfBirth : true,
    fullName : true,
    identityCardNumber : true,
    nationality : true,
    gender : true,
  
  }}>;
};
export type MembersResult = {
  members: Prisma.MemberGetPayload<{}>[];
};
