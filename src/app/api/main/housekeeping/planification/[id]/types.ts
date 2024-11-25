import { Prisma } from "@prisma/client";

export type UpdateHouseKeepingPlanificationData = {
  title?: string;
  description?: string;

  start?: string;
  end?: string;
};

export type HouseKeepingPlanificationResult = {
  HouseKeepingPlanification: Prisma.HouseKeepingPlanificationGetPayload<{select : {
    id : true,
    description : true,
    end : true,
    title : true,
    start : true,
    
  }}>;
};
