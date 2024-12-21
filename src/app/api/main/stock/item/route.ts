import { NextRequest, NextResponse } from "next/server";
// Adjust the import path as needed
import {
  addStockItem,
  getAllStockItems,
 
} from "@/app/api/main/stock/item/controller";
import { AddStockItemData, requiredStockItemFields } from "@/app/api/main/stock/item/types";

import { handleError } from "@/lib/error_handler/handleError";
import { getUser } from "@/lib/token/getUserFromToken";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const user = getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non Authorisé" }, { status: 401 });
    }

    const data: AddStockItemData = await request.json();
    
    const missingFields = requiredStockItemFields.filter(
      (field) => !data[field] && data[field]!==0
    );

    if (missingFields.length > 0) {
      return NextResponse.json(
        { message: `${missingFields.join(", ")}: sont requis` },
        { status: 400 }
      );
    }

    const newStockItem = await addStockItem(data, user.hotelId,user.id,user.role);

    return NextResponse.json(
      { message: "Article de stock crée avec succès" },
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
      return NextResponse.json({ error: "Non Authorisé" }, { status: 401 });
    }
    

    // Check if the user is either an admin or a receptionist
    

    const StockItems = await getAllStockItems(user.hotelId);
    return NextResponse.json(StockItems, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}
