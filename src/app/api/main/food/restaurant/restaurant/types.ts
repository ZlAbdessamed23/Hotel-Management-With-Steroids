import { Prisma } from "@prisma/client";

export type AddRestaurantData = {
  name: string;
  description?: string;
  location?: string;

  restaurantEmployee: {
    employeeId: string;
  }[];
};

export const requiredRestaurantFields: (keyof AddRestaurantData)[] = [
  "name",

  "restaurantEmployee",
];

export type RestaurantResult = {
  Restaurant: Prisma.RestaurantGetPayload<{select: { id: true; name: true; description: true , createdAt : true };}>;
};

export type RestaurantsResult = {
  Restaurants: Prisma.RestaurantGetPayload<{
    select: { id: true; name: true; description: true , createdAt : true };
  }>[];
};
