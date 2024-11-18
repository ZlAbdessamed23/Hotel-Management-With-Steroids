import {
  Prisma,
} from "@prisma/client";

export type StockDashboardData = {
  categoryCount: number;
  items: Prisma.ItemGetPayload<{
    select: {
      quantity: true;
      stockType: true;
      name: true;
      isNeeded: true;
      supplierAddress:true,
      supplierName:true,
      supplierPhone:true,
      category: { select: { name: true } };
    };
  }>[];
  transactions: Prisma.TransactionGetPayload<{
    select: { type: true; transactionAmount: true; stockType: true , createdAt : true };
  }>[];
  budgets: Prisma.BudgetGetPayload<{
    select: { amount: true; stockType: true; id: true };
  }>[];
};

export type StockDashboardResult = {
  data: StockDashboardData;
};
