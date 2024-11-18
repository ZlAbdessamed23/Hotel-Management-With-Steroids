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
  room: Prisma.RoomGetPayload<{}>;
};
export type RoomsResult = {
  rooms: Prisma.RoomGetPayload<{
    include: {
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
    };
  }>[];
};
