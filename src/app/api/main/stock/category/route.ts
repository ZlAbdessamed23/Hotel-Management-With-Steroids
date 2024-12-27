import { NextRequest, NextResponse } from "next/server";
// Adjust the import path as needed
import {
  addStockCategory,
  getAllStockCategories,
  
  
} from "@/app/api/main/stock/category/controller";
import { AddStockCategoryData, requiredStockCategoryFields } from "@/app/api/main/stock/category/types";

import { handleError } from "@/lib/error_handler/handleError";
import { getUser } from "@/lib/token/getUserFromToken";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const user = getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non Authorisé" }, { status: 401 });
    }
    
    

    const data: AddStockCategoryData = await request.json();
    const missingFields = requiredStockCategoryFields.filter(
      (field) => !data[field]
    );
    if (missingFields.length > 0) {
      return NextResponse.json(
        { message: ` ${missingFields.join(", ")}: sont requis` },
        { status: 400 }
      );
    }

    const newStockCategory = await addStockCategory(data, user.hotelId);

    return NextResponse.json(
      { message: "Category de stock crée avec succès" },
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
    

    const StockCategories = await getAllStockCategories(user.hotelId);
    return NextResponse.json({message:"Article de stock crée avec succès"}, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}
