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
  supplierEmail?: string;
  supplierAddress?: string;

  stockCategoryId?: string;
};
export type ItemResult = {
  Item: Prisma.ItemGetPayload<{select : {id : true,name : true ,supplierAddress : true,supplierEmail : true,supplierName : true,supplierPhone : true,sku : true,minimumQuantity : true,
    categoryId : true,isNeeded : true,quantity : true,description : true ,stockId : true,unit : true,unitPrice : true,}}>;
};
