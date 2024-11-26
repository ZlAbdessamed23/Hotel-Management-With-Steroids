import { NextRequest, NextResponse } from "next/server";
// Adjust the import path as needed
import {
  addStockTransaction,
  getAllStockTransactions,
  
} from "./controller";
import {
  AddStockTransactionData,
  requiredStockTransactionFields,
} from "./types";

import { handleError } from "@/lib/error_handler/handleError";
import { getUser } from "@/lib/token/getUserFromToken";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const user = getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non Authorisé" }, { status: 401 });
    }
    console.log(user);
    

    const data: AddStockTransactionData = await request.json();
    const missingFields = requiredStockTransactionFields.filter(
      (field) => !data[field]
    );
    if (missingFields.length > 0) {
      return NextResponse.json(
        { message: `Missing required fields: ${missingFields.join(", ")}` },
        { status: 400 }
      );
    }

    const newStockTransaction = await addStockTransaction(data, user.hotelId,user.id,user.role);

    return NextResponse.json(
      { message: "Transaction de stock crée avec succès" },
      { status: 201 }
    );
  } catch (error) {
    return handleError(error);
  }
}
///////////////////////////// Get ////////////////////////////////////
export async function GET(request: NextRequest) {
  try {
    const user = getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.log(user);

    

    const StockTransactions = await getAllStockTransactions(user.hotelId);
    return NextResponse.json(StockTransactions, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}
