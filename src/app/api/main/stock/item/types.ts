import { Prisma, } from "@prisma/client";

export type AddStockItemData = {
  name: string;
  quantity: number;
  description?:string;
  unitPrice: number;
  sku?: string;
  unit?: string;
  minimumQuantity: number;
  supplierName?: string;
  supplierPhone?: string;
  supplierEmail?:string;

  stockId : string;
  stockCategoryId: string;
};

export const requiredStockItemFields: (keyof AddStockItemData)[] = [
  "name",
  "quantity",
  
  
  
  "unitPrice",
  "minimumQuantity",

  "stockCategoryId",
];

export type ItemResult = {
  Item: Prisma.ItemGetPayload<{}>;
};

export type ItemsResult = {
  Items: Prisma.ItemGetPayload<{}>[];
};
