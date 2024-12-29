import { NextRequest, NextResponse } from "next/server";
// Adjust the import path as needed
import {
  addStockTransaction,
  getAllStockTransactions,
  
} from "@/app/api/main/stock/transaction/controller";
import {
  AddStockTransactionData,
  requiredStockTransactionFields,
} from "@/app/api/main/stock/transaction/types";

import { handleError } from "@/lib/error_handler/handleError";
import { getUser } from "@/lib/token/getUserFromToken";
import { TranslateObjKeysFromEngToFr } from "@/app/utils/translation";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const user = getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non Authorisé" }, { status: 401 });
    }
  
    

    const data: AddStockTransactionData = await request.json();
    const missingFields = requiredStockTransactionFields.filter(
          (field) => !data[field]
        );
    
        if (missingFields.length > 0) {
          const translatedFields = missingFields.map(field => 
            TranslateObjKeysFromEngToFr(field)
          );
    
          return NextResponse.json(
            { message: `${translatedFields.join(", ")}: sont requis` },
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
    

    

    const StockTransactions = await getAllStockTransactions(user.hotelId);
    return NextResponse.json(StockTransactions, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}
