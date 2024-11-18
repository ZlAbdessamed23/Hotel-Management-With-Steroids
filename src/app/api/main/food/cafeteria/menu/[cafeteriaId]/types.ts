import { Prisma } from "@prisma/client";

export type CafeteriaMenusResult = {
    CafeteriaMenus: Prisma.CafeteriaMenuGetPayload<{}>[];
  };