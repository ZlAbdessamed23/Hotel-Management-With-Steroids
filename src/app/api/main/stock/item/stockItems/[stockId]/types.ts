import { Prisma } from "@prisma/client";

export type StockItemsResult = {
  Items: Prisma.ItemGetPayload<{select : {id : true,name : true ,supplierAddress : true,supplierEmail : true,supplierName : true,supplierPhone : true,sku : true,minimumQuantity : true,
    categoryId : true,isNeeded : true,quantity : true,description : true ,unit : true,unitPrice : true,}}>[];
};
