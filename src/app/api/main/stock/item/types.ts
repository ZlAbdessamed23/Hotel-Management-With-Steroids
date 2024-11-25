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
  Item: Prisma.ItemGetPayload<{select : {id : true,name : true ,supplierAddress : true,supplierEmail : true,supplierName : true,supplierPhone : true,sku : true,minimumQuantity : true,
  categoryId : true,isNeeded : true,quantity : true,description : true ,stockId : true,unit : true,unitPrice : true,}}>;
};

export type ItemsResult = {
  Items: Prisma.ItemGetPayload<{select : {id : true,name : true ,supplierAddress : true,supplierEmail : true,supplierName : true,supplierPhone : true,sku : true,minimumQuantity : true,
    categoryId : true,isNeeded : true,quantity : true,description : true ,stockId : true,unit : true,unitPrice : true,}}>[];
};
