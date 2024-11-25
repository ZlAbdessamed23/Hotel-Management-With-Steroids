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
  client: Prisma.ClientGetPayload<{ select : {
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
    
  } }>;
};
export type ClientCardResult = {
  client: Prisma.ClientGetPayload<{
    select : {
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
           unitPrice : true,
           member : {
            select : {
              address : true,
              id : true , 
              email : true,
              phoneNumber : true,
              dateOfBirth : true,
              fullName : true,
              identityCardNumber : true,
              nationality : true,
              gender : true,
            
            }
           }
        }
      }
      
    }
  }>;
};
