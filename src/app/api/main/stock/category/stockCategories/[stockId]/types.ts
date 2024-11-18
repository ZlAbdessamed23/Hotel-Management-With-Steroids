import { Prisma } from "@prisma/client";

export type StockCategoriesResult = {
  Categories: Prisma.CategoryGetPayload<{}>[];
};
