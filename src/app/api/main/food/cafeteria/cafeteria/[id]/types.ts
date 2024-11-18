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
  Cafeteria: Prisma.CafeteriaGetPayload<{}> | null;
};