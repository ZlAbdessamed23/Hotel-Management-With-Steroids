import {
  ReservationState,
  ReservationSource,
  DiscoveryChannel,
  RoomType,
  Prisma,
} from "@prisma/client";
export type ReservationUpdateData = {
  roomNumber?: string;
  roomType?: RoomType;
  startDate?: Date;
  endDate?: Date;
  totalDays?: number;
  status?: ReservationState;
  source?: ReservationSource;
  discoveryChannel?: DiscoveryChannel;
};
export type UpdateReservationResult = {
  reservation: Prisma.ReservationGetPayload<{}>;
};
