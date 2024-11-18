import { Prisma } from "@prisma/client";

export type AddHouseKeepingPlanificationData = {
  title: string;
  description?: string;
  start: string;
  end: string;
  
};

export const requiredHouseKeepingPlanificationFields: (keyof AddHouseKeepingPlanificationData)[] = [
  "title",
  "start",
  "end",

  
];

export type HouseKeepingPlanificationResult = {
  HouseKeepingPlanification: Prisma.HouseKeepingPlanificationGetPayload<{}>;
};
export type HouseKeepingPlanificationsResult = {
    HouseKeepingPlanifications: Prisma.HouseKeepingPlanificationGetPayload<{}>[];
  };