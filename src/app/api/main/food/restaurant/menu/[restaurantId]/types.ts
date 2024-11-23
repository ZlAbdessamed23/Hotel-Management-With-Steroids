import { Prisma } from "@prisma/client";

export type RestaurantMenusResult = {
    RestaurantMenus: Prisma.RestaurantMenuGetPayload<{select : {
      id : true,
      name  :true,
      createdAt : true,
      description : true,
      lunchStartTime : true,
       lunchEndTime : true,
       dinnerStartTime : true,
       dinnerEndTime : true,
       restaurantId : true,
       hotelId:true
        
  
    }}>[];
  };