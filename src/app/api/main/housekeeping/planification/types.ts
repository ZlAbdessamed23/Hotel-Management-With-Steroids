import { Prisma } from "@prisma/client";

export type AddHouseKeepingPlanificationData = {
  title: string;
  description?: string;
  start: Date;
  end: Date;

};

export const requiredHouseKeepingPlanificationFields: (keyof AddHouseKeepingPlanificationData)[] = [
  "title",
  "start",
  "end",
];

export type HouseKeepingPlanificationResult = {
  HouseKeepingPlanification: Prisma.HouseKeepingPlanificationGetPayload<{select : {
    id : true,
    description : true,
    end : true,
    title : true,
    start : true,

  }}>;
};
export type HouseKeepingPlanificationsResult = {
  HouseKeepingPlanifications: Prisma.HouseKeepingPlanificationGetPayload<{select : {
    id : true,
    description : true,
    end : true,
    title : true,
    start : true,
    
  }}>[];
};