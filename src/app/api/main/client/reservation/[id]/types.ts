import { Prisma } from "@prisma/client";

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
     
}}>;
};
