import { Prisma } from "@prisma/client";

export type AddEventSeanceData = {
  title: string;
  description?: string;
  start: string;
  end: string;
  eventId: string;
};

export const requiredEventSeanceFields: (keyof AddEventSeanceData)[] = [
  "title",
  "start",
  "end",

  "eventId",
];

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
