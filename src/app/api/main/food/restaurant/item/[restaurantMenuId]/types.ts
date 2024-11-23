import { Prisma } from "@prisma/client";

export type RestaurantMenuItemsResult = {
  restaurantMenuItems: Prisma.RestaurantMenuItemGetPayload<{select  :{
    id : true,
    name : true,
    description : true,
    mealType : true,
    category : true,
    createdAt : true
  }}>[];
};
