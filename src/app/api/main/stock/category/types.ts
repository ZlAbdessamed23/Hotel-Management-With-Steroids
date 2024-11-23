import { Prisma } from "@prisma/client";

export type AddStockCategoryData = {
  name: string;
  description?: string;
  stockId: string;
};

export const requiredStockCategoryFields: (keyof AddStockCategoryData)[] = [
  "name",
  
  "stockId",
];

export type CategoryResult = {
  Category: Prisma.CategoryGetPayload<{select : {
    id : true,
    description : true,
    createdAt  : true,
    stockId : true,
    name : true,

  }}>;
};

export type CategoriesResult = {
  Categories: Prisma.CategoryGetPayload<{select : {
    id : true,
    description : true,
    createdAt  : true,
    stockId : true,
    name : true,
    
  }}>[];
};
