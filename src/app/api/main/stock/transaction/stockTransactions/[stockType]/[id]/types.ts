import { Prisma } from "@prisma/client";
export type TransactionResult = {
  Transaction: Prisma.TransactionGetPayload<{}>;
};
