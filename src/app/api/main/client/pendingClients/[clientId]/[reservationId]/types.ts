import { Prisma, ReservationState } from "@prisma/client"


export type UpdatePendingClient = {
    updatePendingReservation : Prisma.ReservationGetPayload<{select : {
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

    }}>
}
export type PendingReservationResult = {
    pendingReservation : Prisma.PendingReservationGetPayload<{select : {
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
         
    }}>
}