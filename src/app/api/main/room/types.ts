import {
  RoomType,
  RoomStatus,
  Prisma,
} from "@prisma/client";

export type AddRoomData = {
  type: RoomType;
  number: string;
  floorNumber: string;
  description?: string;
  price: number;
  capacity: number;
  status: RoomStatus;
  
  outOfServiceDescription?: string;
};

export const requiredRoomFields: (keyof AddRoomData)[] = [
  "type",
  "number",
  "floorNumber",
  "price",
  "capacity",
];
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
    
  
    reservation: {
      select: {
        startDate: true;
        endDate: true;
        client: {
          select: {
            id: true;
            fullName: true;
          };
        };
      };
    };
  } }>;
};
export type RoomsResult = {
  rooms: Prisma.RoomGetPayload<{
    select : {
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
          client: {
            select: {
              id: true;
              fullName: true;
            };
          };
        };
      };
    } }>[];
};
