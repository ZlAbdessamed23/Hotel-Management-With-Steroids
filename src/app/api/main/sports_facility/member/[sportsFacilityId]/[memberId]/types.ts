import { Prisma } from "@prisma/client";

export type UpdateSportsFacilityMemberData = {
  email?: string;
  phoneNumber?: string;
  identityCardNumber?: string;
};
export type SportsFacilityMemberResult = {
  sportsFacilityMember: Prisma.SportsFacilityMemberGetPayload<{select :{
    id : true,
    email : true,
    phoneNumber : true,
    clientName:true,
    gender:true,
    identityCardNumber : true,

  }}>;
};
