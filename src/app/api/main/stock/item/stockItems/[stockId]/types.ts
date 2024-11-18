import { Prisma } from "@prisma/client";

export type StockItemsResult = {
  Items: Prisma.ItemGetPayload<{}>[];
};
