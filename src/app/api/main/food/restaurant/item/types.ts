import {
  CafeteriaRestaurentItemCategory,
  MealType,
  Prisma,
} from "@prisma/client";

export type AddRestaurantMenuItemData = {
  name: string;
  description?: string;
  mealType: MealType;
  category: CafeteriaRestaurentItemCategory;
  restaurantMenuId: string;
};

export const requiredRestaurantMenuItemFields: (keyof AddRestaurantMenuItemData)[] =
  ["name", "mealType", "restaurantMenuId"];

export type RestaurantMenuItemResult = {
  restaurantMenuItem: Prisma.RestaurantMenuItemGetPayload<{}>;
};
