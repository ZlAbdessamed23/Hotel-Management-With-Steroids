import {
  ClientOrigin,
  Prisma,
  ReservationSource,
  UserGender,
} from "@prisma/client";

export type AddClientData = {
  fullName: string;
  dateOfBirth: Date;
  phoneNumber: string;
  email?: string;
  membersNumber?: number;
  kidsNumber?: number;
  clientOrigin: ClientOrigin;
  identityCardNumber: string;
  address: string;
  nationality: string;
  gender: UserGender;
  
};

export const requiredClientFields: (keyof AddClientData)[] = [
  "fullName",
  "dateOfBirth",
  "phoneNumber",

  "identityCardNumber",
  "address",
  "nationality",
  "gender",
];
export type ClientResult = {
  client: Prisma.ClientGetPayload<{}>;
};
export type ClientsResult = {
  clients: Prisma.ClientGetPayload<{}>[];
};
