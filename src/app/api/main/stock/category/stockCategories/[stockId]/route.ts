import { getUser } from "@/lib/token/getUserFromToken";
import { NextRequest, NextResponse } from "next/server";
import {
  
  getStockCategories,
  
} from "@/app/api/main/stock/category/stockCategories/[stockId]/controller";
import { handleError } from "@/lib/error_handler/handleError";

export async function GET(
  request: NextRequest,
  { params }: { params: { stockId: string } }
) {
  try {
    const user = getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non Authorisé" }, { status: 401 });
    }

    const {stockId}=params

    

    const stockCategories = await getStockCategories(user.hotelId, stockId);
    return NextResponse.json(stockCategories, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}
