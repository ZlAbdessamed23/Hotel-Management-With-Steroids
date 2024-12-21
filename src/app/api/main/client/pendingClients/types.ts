import { Prisma } from "@prisma/client"

export type PendingClientResults = {
    pendingClients: Prisma.ClientGetPayload<{select : {
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
        
        createdAt : true,
        pendingReservation : {
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
            
          }
        }
        
      }}>[];
};
