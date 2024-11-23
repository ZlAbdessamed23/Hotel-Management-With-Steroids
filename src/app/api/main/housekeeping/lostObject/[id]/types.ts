import { Prisma } from "@prisma/client"

export type LostObject = {
    LostObject:Prisma.LostObjectGetPayload<{select : {
      description : true,
      id : true,
      location : true,
      name : true,
      
    }}>
  }