import { Prisma } from "@prisma/client";

export type AddStockData = {
  name: string;
  description?: string;
  location?: string;

  stockEmployee: {
    employeeId: string;
  }[];
};

export const requiredStockFields: (keyof AddStockData)[] = [
  "name",

  "stockEmployee",
];

export type StockResult = {
  Stock: Prisma.StockGetPayload<{}>;
};

export type StocksResult = {
  Stocks: Prisma.StockGetPayload<{
    select: { id: true; name: true; description: true , createdAt : true };
  }>[];
};
