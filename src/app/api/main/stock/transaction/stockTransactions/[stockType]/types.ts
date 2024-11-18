import { Prisma } from "@prisma/client";

export type StockTransactionsResult = {
  Transactions: Prisma.TransactionGetPayload<{}>[];
};
