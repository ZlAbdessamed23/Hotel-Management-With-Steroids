import { Prisma } from "@prisma/client";

export type UpdateRestaurantData = {
  name?: string;
  description?: string;
  content?: string;
  restaurantEmployee?: {
    employeeId: string;
  }[];
};

export type RestaurantResult = {
  Restaurant: Prisma.RestaurantGetPayload<{select: { id: true, name: true, description: true , createdAt : true }}> | null;
};