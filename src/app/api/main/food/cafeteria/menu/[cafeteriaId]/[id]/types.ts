import { Prisma } from "@prisma/client";

export type UpdateCafeteriaMenuData = {
  name?: string;
  description?: string;
  startTime?: string;
  endTime?: string;
};
export type CafeteriaMenuResult = {
  CafeteriaMenu: Prisma.CafeteriaMenuGetPayload<{select : {
    id : true,
    endTime : true,
    startTime : true,
    name : true,
    createdAt : true,
    cafeteriaId : true,
    description : true,

  }}>;
};
