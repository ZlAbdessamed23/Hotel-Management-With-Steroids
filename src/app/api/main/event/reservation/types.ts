import {
  DiscoveryChannel,
  Prisma,
  ReservationSource,
  ReservationState,
  RoomType,
} from "@prisma/client";

export type CreateReservationWithAttendeeData = {
  roomNumber: string;
  roomType: RoomType;
  startDate: Date;
  endDate: Date;
  
  state?: ReservationState;
  source?: ReservationSource;
  currentOccupancy?: number;
  discoveryChannel?: DiscoveryChannel;
  eventId: string;
  attendueId: string;
};
export const requiredAttendueReservationFields: (keyof CreateReservationWithAttendeeData)[] =
  [
    "roomNumber",
    "roomType",
    "startDate",
    "endDate",
    

    "attendueId",

    "eventId",
  ];

export type ReservationWithAttendeeResult = {
  reservation: Prisma.ReservationGetPayload<{
    select : {
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
       attendues : {select : {
        address : true,
        id : true,
        phoneNumber : true,
        email : true,
        eventId : true,
        dateOfBirth : true,
        identityCardNumber : true,
        fullName : true,
        gender : true,
        nationality : true,
        type : true,
        reservationSource : true,
       }}
       
  }
  }>;
};
