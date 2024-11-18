import { Prisma } from "@prisma/client";

export type UpdateRestaurantMenuData = {
  name?: string;
  description?: string;
  lunchStartTime?: string;
  lunchEndTime?: string;
  dinnerStartTime?: string;
  dinnerEndTime?: string;
};
export type RestaurantMenuResult = {
  RestaurantMenu: Prisma.RestaurantMenuGetPayload<{}>;
};
