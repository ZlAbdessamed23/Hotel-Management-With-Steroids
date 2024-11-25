import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma/prismaClient";

export async function POST(req: NextRequest) {
  try {
    const {
      name,
      price,
      currency,
      availableChat,
      availableReportManagement,
      availableEventManagement,
      availableCafeteriaManagement,
      availableStockManagement,
      availableSportManagement,
      maxEmployees,
      maxClients,
      maxRooms,
      maxReports,
      maxEvents,
      maxSales,
      maxCafeteriaMenu,
      maxRestaurantMenu,
      maxNotes,
      maxTasks,
      maxStockCategory,
      maxStockItem,
      maxStockTransactions,
      maxHouseKeepingPlanifications,
      maxCafeterias,
      maxRestaurants,
      maxStocks,
      createdAt,
      subscription,
    } = await req.json();

    const plan = await prisma.plan.create({
      data: {
        name,
        price,
        currency,
        availableCafeteriaManagement,
        availableChat,
        availableEventManagement,
        availableReportManagement,
        availableSportManagement,
        availableStockManagement,
        maxClients,
        maxEmployees,
        maxEvents,
        maxReports,
        maxRooms,
        maxSales,
        maxCafeteriaMenu,
        maxRestaurantMenu,
        maxTasks,
        maxNotes,
        maxStockCategory,
        maxStockItem,
        createdAt,
        subscription,
        maxStockTransactions,
        maxHouseKeepingPlanifications,
        maxCafeterias,
        maxRestaurants,
        maxStocks,
      },
    });

    if (!plan) {
      return NextResponse.json(
        { message: "Failed to create the plan" },
        { status: 400 }
      );
    }

    return NextResponse.json(plan, { status: 200 });
  } catch (error) {
    console.error("Error creating plan:", error);
    return NextResponse.json({ message: `${(error as Error).message}` }, { status: 500 });
  };
};
