import { Prisma } from "@prisma/client";

export type RestaurantMenuItemsResult = {
  restaurantMenuItems: Prisma.RestaurantMenuItemGetPayload<{}>[];
};
