import { Prisma } from "@prisma/client";

export type AddRestaurantMenuData = {
  name: string;
  description: string;

  lunchStartTime: string;
  lunchEndTime: string;
  dinnerStartTime: string;
  dinnerEndTime: string;
  restaurantId: string;
};

export const requiredRestaurantMenuFields: (keyof AddRestaurantMenuData)[] = [
  "name",
  "description",

  "lunchStartTime",
  "lunchEndTime",
  "dinnerStartTime",
  "dinnerEndTime",
  "restaurantId"
];

export type RestaurantMenuResult = {
  RestaurantMenu: Prisma.RestaurantMenuGetPayload<{}>;
};

export type RestaurantMenusResult = {
  RestaurantMenus: Prisma.RestaurantMenuGetPayload<{}>[];
};
