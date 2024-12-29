import { NextRequest, NextResponse } from "next/server";
import { AddStockData, requiredStockFields } from "@/app/api/main/stock/stock/types";
import { addStock, getAllStocks,checkReceptionManagerStockManagerAdminRole } from "@/app/api/main/stock/stock/controller";
import { handleError } from "@/lib/error_handler/handleError";
import { getUser } from "@/lib/token/getUserFromToken";
import { TranslateObjKeysFromEngToFr } from "@/app/utils/translation";

export async function POST(request: NextRequest): Promise<NextResponse> {
    try {
      const user = getUser(request);
      if (!user) {
        return NextResponse.json({ error: "Non Authorisé" }, { status: 401 });
      }
      checkReceptionManagerStockManagerAdminRole(user.role)
  
      const data: AddStockData = await request.json();
      const missingFields = requiredStockFields.filter(
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