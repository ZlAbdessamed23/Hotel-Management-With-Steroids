import { getUser } from "@/lib/token/getUserFromToken";
import { NextRequest, NextResponse } from "next/server";
import {
  
  deleteStockTransactionById,
  getStockTransactionById,
} from "./controller";
import { handleError } from "@/lib/error_handler/handleError";

export async function GET(
  request: NextRequest,
  { params }: { params: { stockId:string,id: string } }
): Promise<NextResponse> {
  try {
    const user = getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non Authorisé" }, { status: 401 });
    }
    

    const {stockId,id}=params
    const Transaction = await getStockTransactionById(
      id,
      stockId,
      user.hotelId,
      user.id,
      user.role
    );

    return NextResponse.json(Transaction, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}
export async function DELETE(
  request: NextRequest,
  { params }: { params: { stockId:string,id: string } }
): Promise<NextResponse> {
  try {
    const user = getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non Authorisé" }, { status: 401 });
    }
    

    const {stockId,id}=params
    const Transaction = await deleteStockTransactionById(
      id,
      stockId,
      user.hotelId,
      user.id,
      user.role
    );

    return NextResponse.json(Transaction, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}
