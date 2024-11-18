import { Prisma, } from "@prisma/client";

export type UpdateStockItemData = {
  name?: string;
  quantity?: number;
  unitPrice?: number;
  sku?: string;
  unit?: string;
  minimumQuantity?: number;
  supplierName?: string;
  supplierPhone?: string;

  stockCategoryId?: string;
};
export type ItemResult = {
  Item: Prisma.ItemGetPayload<{}>;
};
