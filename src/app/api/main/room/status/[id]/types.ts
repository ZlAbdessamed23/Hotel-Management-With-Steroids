import { Prisma } from "@prisma/client";
export type UpdateRoomStateData = {
  isFixed: boolean;
  
  outOfServiceDescription?: string;
};
export type RoomResult = {
  room: Prisma.RoomGetPayload<{}>;
};
