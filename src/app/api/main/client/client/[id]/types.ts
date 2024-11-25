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
