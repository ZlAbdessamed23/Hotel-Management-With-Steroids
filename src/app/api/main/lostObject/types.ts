import { Prisma } from "@prisma/client"
export type AddLostObjectData = {
    name :string;
    description?:string;
    location:string

  };
  
  export const requiredLostObjectFields: (keyof AddLostObjectData)[] = [
    "name",
    "location"
  ];

export type LostObject = {
    LostObject:Prisma.LostObjectGetPayload<{}>
  }
  export type LostObjects = {
    LostObjects:Prisma.LostObjectGetPayload<{}>[]
  }