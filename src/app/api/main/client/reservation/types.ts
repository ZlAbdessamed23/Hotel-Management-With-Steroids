import {
  ReservationState,
  ReservationSource,
  RoomType,
  Prisma,
  DiscoveryChannel,
} from "@prisma/client";

export type AddReservationData = {
  roomNumber: string;
  roomType: RoomType;
  startDate: Date;
  endDate: Date;
  totalDays: number;
  totalPrice: number;
  
  state: ReservationState;
  source?: ReservationSource;
  clientId: string;
  discoverChannel?: DiscoveryChannel;
  
};

export const requiredReservationFields: (keyof AddReservationData)[] = [
  "roomNumber",
  "roomType",
  "startDate",
  "endDate",
  "totalDays",

  "state",
  "source",
  "clientId",
];
export type ReservationResult = {
  reservation: Prisma.ReservationGetPayload<{select : {
    id : true,
    startDate : true,
    endDate : true,
    unitPrice : true,
     totalDays : true,
     totalPrice : true,
     currentOccupancy : true,
     discoveryChannel : true,
     roomNumber : true,
     roomType : true,
     source : true,
     state : true , 
     
}}>|Prisma.PendingReservationGetPayload<{select : {
  id : true,
  startDate : true,
  endDate : true,
  unitPrice : true,
   totalDays : true,
   totalPrice : true,
   currentOccupancy : true,
   discoveryChannel : true,
   roomNumber : true,
   roomType : true,
   source : true,
   state : true , 
   
}}>;
};
export type ReservationsResult = {
  reservations: Prisma.ReservationGetPayload<{select : {
    id : true,
    startDate : true,
    endDate : true,
    unitPrice : true,
     totalDays : true,
     totalPrice : true,
     currentOccupancy : true,
     discoveryChannel : true,
     roomNumber : true,
     roomType : true,
     source : true,
     state : true , 
     
}}>[];
};
