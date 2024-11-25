import { Prisma } from "@prisma/client";
export type StocksResult = {
  Stocks: Prisma.StockGetPayload<{
    select: { id: true; name: true; description: true };
  }>[];
};
