import { Prisma } from "@prisma/client";

export type UpdateCafeteriaMenuData = {
  name?: string;
  description?: string;
  startTime?: string;
  endTime?: string;
};
export type CafeteriaMenuResult = {
  CafeteriaMenu: Prisma.CafeteriaMenuGetPayload<{}>;
};
