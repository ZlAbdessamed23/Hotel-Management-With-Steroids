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
  Event: Prisma.EventGetPayload<{select : {
    bankCard : true,
    createdAt : true,
    name : true,
    description : true,
    guests : true,
    leader : true,
    id : true,
    startDate : true,
    endDate : true , 
    eventType : true,

  }}>;
};

export type EventsResult = {
  Events: Prisma.EventGetPayload<{select : {
    bankCard : true,
    createdAt : true,
    name : true,
    description : true,
    guests : true,
    leader : true,
    id : true,
    startDate : true,
    endDate : true , 
    eventType : true,
    
  }}>[];
};
