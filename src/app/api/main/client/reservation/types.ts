import {
  ReservationState,
  ReservationSource,
  RoomType,
  Prisma,
  DiscoveryChannel,
} from "@prisma/client";

export type AddReservationData = {
  roomNumber: string;
  roomType: RoomType;
  startDate: Date;
  endDate: Date;
  totalDays: number;
  totalPrice: number;
  
  state: ReservationState;
  source?: ReservationSource;
  clientId: string;
  discoverChannel?: DiscoveryChannel;
  
};

export const requiredReservationFields: (keyof AddReservationData)[] = [
  "roomNumber",
  "roomType",
  "startDate",
  "endDate",
  "totalDays",

  "state",
  "source",
  "clientId",
];
export type ReservationResult = {
  reservation: Prisma.ReservationGetPayload<{}>;
};
export type ReservationsResult = {
  reservations: Prisma.ReservationGetPayload<{}>[];
};
