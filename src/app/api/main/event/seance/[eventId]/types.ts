import { Prisma } from "@prisma/client";

export type EventEventSeancesResult = {
  EventSeances: Prisma.EventSeanceGetPayload<{}>[];
};
