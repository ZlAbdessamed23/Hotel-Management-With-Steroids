import { Prisma } from "@prisma/client";

export type StockCategoriesResult = {
  Categories: Prisma.CategoryGetPayload<{select : {
    id : true,
    description : true,
    createdAt  : true,
    stockId : true,
    name : true,
    
  }}>[];
};
