import { Prisma } from "@prisma/client";
export type StatisticsResult = {
  Statistics: Prisma.StatisticsGetPayload<{}>[];
};
