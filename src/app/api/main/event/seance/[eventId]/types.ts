import { Prisma } from "@prisma/client";

export type EventEventSeancesResult = {
  EventSeances: Prisma.EventSeanceGetPayload<{select : {
    id : true,
    description : true,
    end : true,
    start : true,
    eventId : true,
    title : true,
    createdAt : true,
  }}>[];
};
