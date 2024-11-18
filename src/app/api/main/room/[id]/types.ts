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
  room: Prisma.RoomGetPayload<{include:{reservation:true}}>;
};
