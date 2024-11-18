import { getUser } from "@/lib/token/getUserFromToken";
import { NextRequest, NextResponse } from "next/server";
import {
  
  getStockItems,
  
} from "@/app/api/main/stock/item/stockItems/[stockId]/controller";
import { handleError } from "@/lib/error_handler/handleError";

export async function GET(
  request: NextRequest,
  { params }: { params: { stockId: string } }
) {
  try {
    const user = getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const {stockId}=params
    

    const stockItems = await getStockItems(stockId,user.hotelId,user.id,user.role );
    return NextResponse.json(stockItems, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}
