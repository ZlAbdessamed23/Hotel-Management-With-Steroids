import {
  CafeteriaRestaurentItemCategory,
  MealType,
  Prisma,
} from "@prisma/client";

export type UpdateRestaurantMenuItemData = {
  name?: string;
  description?: string;
  mealType?: MealType;
  category: CafeteriaRestaurentItemCategory;
};
export type RestaurantMenuItemResult = {
  restaurantMenuItem: Prisma.RestaurantMenuItemGetPayload<{select  :{
    id : true,
    name : true,
    description : true,
    mealType : true,
    category : true,
    createdAt : true
  }}>;
};
