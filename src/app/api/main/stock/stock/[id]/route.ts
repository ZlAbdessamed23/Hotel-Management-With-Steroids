import { getUser } from "@/lib/token/getUserFromToken";
import { NextRequest, NextResponse } from "next/server";
import { updateStock, getStockById, deleteStock, checkAdminRole } from "@/app/api/main/stock/stock/[id]/controller";
import { UpdateStockData } from "@/app/api/main/stock/stock/[id]/types";
import { handleError } from "@/lib/error_handler/handleError";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const user = getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.log(user);
    checkAdminRole(user.role)

    const StockId = params.id;
    const Stock = await getStockById(
      StockId,
      user.hotelId,
      
    );

    return NextResponse.json(Stock, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const user = getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non Authorisé" }, { status: 401 });
    }
    console.log(user);
    checkAdminRole(user.role)

    const StockId = params.id;
    const deletedStock = await deleteStock(
      StockId,
      user.hotelId,
      
    );

    return NextResponse.json(
      { message: "Rapport supprimé avec succès" },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const user = getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    checkAdminRole(user.role)
    const StockId = params.id;
    const updateData:UpdateStockData = await request.json();

    const updatedStock = await updateStock(
      StockId,
      user.hotelId,
      updateData
    );

    return NextResponse.json(
      { message: "Rapport mis à jour avec succès" },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error);
  }
}
