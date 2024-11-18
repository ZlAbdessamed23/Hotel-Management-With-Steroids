import { Prisma } from "@prisma/client";

export type UpdateStockData = {
  name?: string;
  description?: string;
  content?: string;
  stockEmployee?: {
    employeeId: string;
  }[];
};

export type StockResult = {
  Stock: Prisma.StockGetPayload<{}> | null;
};