import { Prisma, TransactionOperationType,  } from "@prisma/client";

export type AddStockTransactionData = {
  quantity: number;

  type: TransactionOperationType;

  stockId: string;
  stockItemId: string;
};

export const requiredStockTransactionFields: (keyof AddStockTransactionData)[] =
  ["quantity", "type", "stockId", "stockItemId"];

export type TransactionResult = {
  Transaction: Prisma.TransactionGetPayload<{select:{
    id:true,
    transactionAmount:true,
    type:true,
    quantity:true,
    createdAt:true,
    itemId:true,
    hotelId:true
  }}>;
};

export type TransactionsResult = {
  Transactions: Prisma.TransactionGetPayload<{select:{
    id:true,
    transactionAmount:true,
    type:true,
    quantity:true,
    createdAt:true,
    itemId:true,
    hotelId:true
  }}>[];
};
