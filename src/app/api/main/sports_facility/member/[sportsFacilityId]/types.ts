import { Prisma } from "@prisma/client";

export type SportsFacilitiesResult = {
  sportsFacilitiesMember: Prisma.SportsFacilityMemberGetPayload<{}>[];
};
