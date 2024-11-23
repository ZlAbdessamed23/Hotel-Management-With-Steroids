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
  ClientsHistorique: Prisma.ClientsHistoriqueGetPayload<{select : {
    fullName : true,
    starDate : true,
    endDate : true,
    gender : true,
    identityCardNumber : true,
    id : true,
    nationality : true,
    phoneNumber : true,
    createdAt : true,

  }}>[];
};
export type ClientHistorique = {
  ClientHistorique: Prisma.ClientsHistoriqueGetPayload<{}>;
};
