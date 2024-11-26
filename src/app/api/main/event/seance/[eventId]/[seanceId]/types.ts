import { Prisma } from "@prisma/client";

export type UpdateEventSeanceData = {
  title?: string;
  description?: string;

  start?: string;
  end?: string;
};

export type EventSeanceResult = {
  EventSeance: Prisma.EventSeanceGetPayload<{select : {
    id : true,
    description : true,
    end : true,
    start : true,
    eventId : true,
    title : true,
    createdAt : true,
  }}>;
};
