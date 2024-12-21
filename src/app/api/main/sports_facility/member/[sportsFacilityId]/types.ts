import { Prisma } from "@prisma/client";

export type SportsFacilitiesResult = {
  sportsFacilitiesMember: Prisma.SportsFacilityMemberGetPayload<{select :{
    id : true,
    email : true,
    phoneNumber : true,
    clientName:true,
    gender:true,
    identityCardNumber : true,

  }}>[];
};
