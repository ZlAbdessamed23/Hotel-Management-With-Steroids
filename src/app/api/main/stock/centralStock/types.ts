import {
  Prisma,
} from "@prisma/client";

export type StockDashboardData = {
  categoryCount: number;
  items: Prisma.ItemGetPayload<{
    select: {
      quantity: true;
      name: true;
      isNeeded: true;
      supplierAddress:true,
      supplierName:true,
      supplierPhone:true,
      stockId:true,
      category: { select: { name: true } };
    };
  }>[];
  transactions: Prisma.TransactionGetPayload<{
    select: { type: true; transactionAmount: true , createdAt : true,stockId:true, };
  }>[];
  budgets: Prisma.BudgetGetPayload<{
    select: { amount: true, id: true,stockId:true };
  }>[];
  stocks : Prisma.StockGetPayload<{
    select: { name: true, id: true, };
  }>[];
};

export type StockDashboardResult = {
  data: StockDashboardData;
};
