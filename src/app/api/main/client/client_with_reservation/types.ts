import {
  UserGender,
  ReservationState,
  ReservationSource,
  RoomType,
  Prisma,
  DiscoveryChannel,
  ClientOrigin,
} from "@prisma/client";

export type ClientReservationData = {
  fullName: string;
  dateOfBirth: Date;
  phoneNumber: string;
  email?: string;
  membersNumber?: number;
  kidsNumber?: number;
  identityCardNumber: string;
  address: string;
  nationality: string;
  clientOrigin: ClientOrigin;
  gender: UserGender;
  
  roomNumber: string;
  roomType: RoomType;
  startDate: Date;
  endDate: Date;
  totalDays: number;
  state: ReservationState;
  source?: ReservationSource;
  discoveryChannel?: DiscoveryChannel;
};

export const requiredFields: (keyof ClientReservationData)[] = [
  "fullName",
  "dateOfBirth",
  "phoneNumber",

  "identityCardNumber",
  "address",
  "nationality",
  "gender",

  "roomNumber",
  "roomType",
  "startDate",
  "endDate",
  "totalDays",

  "state",
];
export type ClientReservationResult = {
  client: Prisma.ClientGetPayload<{
    include: { reservations: true; pendingReservation: true };
  }>;
};
export type ClientsWithReservations = {
  clients: Prisma.ClientGetPayload<{ select : {
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
    reservations : {
      select : {
        id:true,
        roomNumber : true,
        roomType : true,
        createdAt : true,
        totalDays : true,
        totalPrice : true , 
        currentOccupancy : true,
        discoveryChannel : true,
         source : true,
         state : true,
         startDate : true,
         endDate : true,
         unitPrice : true
      }
    }
    
  } }>[];
};
