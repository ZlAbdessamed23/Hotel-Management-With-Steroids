import { CafeteriaRestaurentItemCategory, Prisma } from "@prisma/client";

export type UpdateCafeteriaMenuItemData = {
  name?: string;
  description?: string;
  category: CafeteriaRestaurentItemCategory;
};
export type CafeteriaMenuItemResult = {
  cafeteriaMenuItem: Prisma.CafeteriaMenuItemGetPayload<{select : {
    id : true,
    name : true,
    description : true,
    cafeteriaMenuId : true,
    category : true,
    
  }}>;
};
