import { Prisma, UserGender } from "@prisma/client";

export type AddSportsFacilityMemberData = {
  email?: string;
  phoneNumber?: string;
  identityCardNumber?: string;
  sportsFacilityId: string;
  gender : UserGender;
};

export const requiredSportsFacilityFields: (keyof AddSportsFacilityMemberData)[] =
  ["sportsFacilityId"];

export type SportsFacilityMemberResult = {
  sportsFacilityMember: Prisma.SportsFacilityMemberGetPayload<{}>;
};


