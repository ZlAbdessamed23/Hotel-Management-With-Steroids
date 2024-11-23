import { Prisma } from "@prisma/client";

export type CafeteriaMenuItemsResult = {
  cafeteriaMenuItems: Prisma.CafeteriaMenuItemGetPayload<{select : {
    id : true,
    name : true,
    description : true,
    cafeteriaMenuId : true,
    category : true,
    
  }}>[];
  
};

