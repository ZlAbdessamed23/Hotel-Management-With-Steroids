import { Prisma, UserGender } from "@prisma/client";
export type AddClientsHistoriqueData = {
  fullName: string;
  phoneNumber: string;
  identityCardNumber: string;
  nationality: string;
  gender: UserGender;
  starDate: Date;
  endDate: Date;
};

export type ClientsHistorique = {
  ClientsHistorique: Prisma.ClientsHistoriqueGetPayload<{}>[];
};
export type ClientHistorique = {
  ClientHistorique: Prisma.ClientsHistoriqueGetPayload<{}>;
};
