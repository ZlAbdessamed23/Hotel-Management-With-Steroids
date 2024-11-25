import { Prisma } from "@prisma/client";

export type UpdateCafeteriaData = {
  name?: string;
  description?: string;
  content?: string;
  cafeteriaEmployee?: {
    employeeId: string;
  }[];
};

export type CafeteriaResult = {
  Cafeteria: Prisma.CafeteriaGetPayload<{select : {
    id : true,
  location : true,
  name : true,
  description : true,
  createdAt : true    
  }}> | null;
};