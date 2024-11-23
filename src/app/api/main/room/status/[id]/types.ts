import { Prisma } from "@prisma/client";
export type UpdateRoomStateData = {
  isFixed: boolean;
  
  outOfServiceDescription?: string;
};
export type RoomResult = {
  room: Prisma.RoomGetPayload<{select : {
    id : true,
    capacity : true,
    description : true,
    floorNumber : true,
    number : true,
    outOfServiceDescription : true,
    price : true,
    status : true,
    type : true,
    
  
    
  } }>;
};
