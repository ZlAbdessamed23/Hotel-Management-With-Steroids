import { Prisma, EventType } from "@prisma/client";

export type AddEventData = {
  name: string;
  leader: string;
  guests?: number;
  description?: string;
  bankCard?: string;
  startDate: Date;
  endDate: Date;
  eventType: EventType;
};

export const requiredEventFields: (keyof AddEventData)[] = [
  "name",
  "leader",
  "startDate",
  "endDate",
  "eventType",
];

export type EventResult = {
  Event: Prisma.EventGetPayload<{}>;
};

export type EventsResult = {
  Events: Prisma.EventGetPayload<{}>[];
};
