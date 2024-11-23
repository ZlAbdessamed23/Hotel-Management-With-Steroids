import { Prisma, UserGender } from "@prisma/client";

export type UpdateMemberData = {
  fullName?: string;
  dateOfBirth?: Date;
  phoneNumber?: string;
  email?: string;
  identityCardNumber?: string;
  address?: string;
  nationality?: string;
  gender?: UserGender;
};
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
