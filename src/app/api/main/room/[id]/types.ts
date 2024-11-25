import { Prisma, RoomStatus, RoomType } from "@prisma/client";

export type UpdateRoomData = {
  type?: RoomType;
  number?: string;
  floorNumber?: string;
  description?: string;
  price?: number;
  capacity?: number;
  status?: RoomStatus;
  
  outOfServiceDescription?: string;
};
export type RoomResult = {
  room: Prisma.RoomGetPayload<{}>;
};
export type getRoomResult = {
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
    
  
    reservation: {
      select: {
        startDate: true;
        endDate: true;
        
      };
    };
  }}>;
};
