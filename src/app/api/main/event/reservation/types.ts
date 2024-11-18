import {
  DiscoveryChannel,
  Prisma,
  ReservationSource,
  ReservationState,
  RoomType,
} from "@prisma/client";

export type CreateReservationWithAttendeeData = {
  roomNumber: string;
  roomType: RoomType;
  startDate: Date;
  endDate: Date;
  totalDays: number;
  state?: ReservationState;
  source?: ReservationSource;
  currentOccupancy?: number;
  discoveryChannel?: DiscoveryChannel;
  eventId: string;
  attendueId: string;
};
export const requiredAttendueReservationFields: (keyof CreateReservationWithAttendeeData)[] =
  [
    "roomNumber",
    "roomType",
    "startDate",
    "endDate",
    "totalDays",

    "attendueId",

    "eventId",
  ];

export type ReservationWithAttendeeResult = {
  reservation: Prisma.ReservationGetPayload<{
    include: { attendues: true };
  }>;
};
