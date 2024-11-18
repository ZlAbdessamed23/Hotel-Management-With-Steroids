import { ClientOrigin, Prisma, ReservationSource, UserGender } from "@prisma/client";

export type UpdateClientData = {
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
  clientOrigin? : ClientOrigin
  
};
export type ClientResult = {
  client: Prisma.ClientGetPayload<{}>;
};
