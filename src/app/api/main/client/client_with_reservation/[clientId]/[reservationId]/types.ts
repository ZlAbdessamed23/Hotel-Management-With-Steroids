import {
  DiscoveryChannel,
  Prisma,
  ReservationSource,
  ReservationState,
  RoomType,
  UserGender,
  ClientOrigin,
} from "@prisma/client";

export type ClientReservationData = {
  fullName?: string;
  dateOfBirth?: Date;
  phoneNumber?: string;
  email?: string;
  kidsNumber?: number;
  membersNumber?: number;
  identityCardNumber?: string;
  address?: string;
  nationality?: string;
  gender?: UserGender;
  clientOrigin: ClientOrigin;

  roomNumber?: string;
  roomType?: RoomType;
  startDate?: Date;
  endDate?: Date;
  totalDays?: number;
  status?: ReservationState;
  source?: ReservationSource;
  discoveryChannel?: DiscoveryChannel;
};
export type ClientWithReservationResult = {
  client: Prisma.ClientGetPayload<{ include: { reservations: true } }>;
};
export type ClientCardResult = {
  client: Prisma.ClientGetPayload<{
    include: { reservations: { include: { member: true } } };
  }>;
};
