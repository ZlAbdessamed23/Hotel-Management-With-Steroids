import { Prisma } from "@prisma/client";

export type RestaurantMenusResult = {
    RestaurantMenus: Prisma.RestaurantMenuGetPayload<{}>[];
  };