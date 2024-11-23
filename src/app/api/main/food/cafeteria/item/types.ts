import { CafeteriaRestaurentItemCategory, Prisma } from "@prisma/client";

export type AddCafeteriaMenuItemData = {
  name: string;
  description?: string;
  category: CafeteriaRestaurentItemCategory;
  cafeteriaMenuId: string;
};

export const requiredRestaurantMenuItemFields: (keyof AddCafeteriaMenuItemData)[] =
  ["name", "cafeteriaMenuId", "category"];

export type CafeteriaMenuItemResult = {
  cafeteriaMenuItem: Prisma.CafeteriaMenuItemGetPayload<{select : {
    id : true,
    name : true,
    description : true,
    cafeteriaMenuId : true,
    category : true,
    
  }}>;
};
