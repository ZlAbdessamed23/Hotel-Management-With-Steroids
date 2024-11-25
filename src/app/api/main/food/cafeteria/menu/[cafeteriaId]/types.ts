import { Prisma } from "@prisma/client";

export type CafeteriaMenusResult = {
    CafeteriaMenus: Prisma.CafeteriaMenuGetPayload<{select : {
      id : true,
      endTime : true,
      startTime : true,
      name : true,
      createdAt : true,
      cafeteriaId : true,
      description : true,

    }}>[];
  };