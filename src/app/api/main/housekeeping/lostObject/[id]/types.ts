import { Prisma } from "@prisma/client"
export type UpdateLostObjectData = {
  description?: string,
  location?: string,
  name?: string,
  
};
export type LostObject = {
    LostObject:Prisma.LostObjectGetPayload<{select : {
      description : true,
      id : true,
      location : true,
      name : true,
      
    }}>
  }
