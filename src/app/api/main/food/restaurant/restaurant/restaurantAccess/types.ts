import { Prisma } from "@prisma/client";
export type RestaurantsResult = {
  Restaurants: Prisma.RestaurantGetPayload<{
    select: { id: true; name: true; description: true };
  }>[];
};
