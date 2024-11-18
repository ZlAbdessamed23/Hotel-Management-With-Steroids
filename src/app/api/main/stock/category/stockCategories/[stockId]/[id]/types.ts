import { Prisma } from "@prisma/client";

export type UpdateStockCategoryData = {
  name?: string;
  description?: string;
  
};
export type CategoryResult = {
  Category: Prisma.CategoryGetPayload<{}>;
};
