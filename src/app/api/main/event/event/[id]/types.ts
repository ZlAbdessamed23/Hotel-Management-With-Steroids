import { Prisma, EventType } from "@prisma/client";

export type UpdateEventData = {
  name?: string;
  leader?: string;
  guests?: number;
  description?: string;
  bankCard?: string;
  startDate?: Date;
  endDate?: Date;
  eventType?: EventType;
};
export type EventResult = {
  Event: Prisma.EventGetPayload<{}>;
};
