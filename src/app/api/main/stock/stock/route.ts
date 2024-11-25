import { NextRequest, NextResponse } from "next/server";
import { AddStockData, requiredStockFields } from "@/app/api/main/stock/stock/types";
import { addStock, getAllStocks,checkAdminRole } from "@/app/api/main/stock/stock/controller";
import { handleError } from "@/lib/error_handler/handleError";
import { getUser } from "@/lib/token/getUserFromToken";

export async function POST(request: NextRequest): Promise<NextResponse> {
    try {
      const user = getUser(request);
      if (!user) {
        return NextResponse.json({ error: "Non Authorisé" }, { status: 401 });
      }
      checkAdminRole(user.role)
  
      const data: AddStockData = await request.json();
      const missingFields = requiredStockFields.filter(
        (field) => !data[field]
      );
      if (missingFields.length > 0) {
        return NextResponse.json(
          { message: `${missingFields.join(", ")}: sont requis ` },
          { status: 400 }
        );
      }
  
      const newStock = await addStock(
        data,
        user.hotelId,
        
      );
  
      return NextResponse.json(
        { message: "Stock crée avec succès" },
        { status: 201 }
      );
    } catch (error) {
      return handleError(error);
    }
  }
  
  export async function GET(request: NextRequest) {
    try {
      const user = getUser(request);
      if (!user) {
        return NextResponse.json({ error: "Non Authorisé" }, { status: 401 });
      }
      
  
      const Stocks = await getAllStocks(user.hotelId);
      return NextResponse.json(Stocks, { status: 200 });
    } catch (error) {
      return handleError(error);
    }
  }