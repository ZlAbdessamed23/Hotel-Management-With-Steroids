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
  client: Prisma.ClientGetPayload<{select : {
    fullName : true,
    address : true,
    email : true,
    phoneNumber : true,
    id : true,
    identityCardNumber : true,
    gender : true,
    dateOfBirth : true ,
    clientOrigin : true,
    kidsNumber : true,
    nationality : true,
    membersNumber : true,
    hotelId : true,
    createdAt : true,

  }}>;
};
export type ClientsResult = {
  clients: Prisma.ClientGetPayload<{select : {
    fullName : true,
    address : true,
    email : true,
    phoneNumber : true,
    id : true,
    identityCardNumber : true,
    gender : true,
    dateOfBirth : true ,
    clientOrigin : true,
    kidsNumber : true,
    nationality : true,
    membersNumber : true,
    hotelId : true,
    createdAt : true,
    
  }}>[];
};
