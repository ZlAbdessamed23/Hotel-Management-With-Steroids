import { getUser } from "@/lib/token/getUserFromToken";
import { NextRequest, NextResponse } from "next/server";
import {
  checkReceptionManagerStockManagerAdminRole,
  getStockData,
} from "@/app/api/main/stock/centralStock/controller";
import { handleError } from "@/lib/error_handler/handleError";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const user = getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non Authorisé" }, { status: 401 });
    }
    
    checkReceptionManagerStockManagerAdminRole(user.role);
    const Statistics = await getStockData(user.hotelId);
    return NextResponse.json(Statistics, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}
