import { getUser } from "@/lib/token/getUserFromToken";
import { NextRequest, NextResponse } from "next/server";
import {
 
  deleteStockItem,
  getStockItemById,
  updateStockItem,
} from "./controller";
import { handleError } from "@/lib/error_handler/handleError";

export async function GET(
  request: NextRequest,
  { params }: { params: { stockId : string,id: string } }
): Promise<NextResponse> {
  try {
    const user = getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non Authorisé" }, { status: 401 });
    }
    const {stockId,id}=params

    const stockItemId = params.id;
    const Item = await getStockItemById(id,stockId, user.hotelId,user.id,user.role);

    return NextResponse.json(Item, { status: 200 });
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
    const deletedItem = await deleteStockItem(id,stockId, user.hotelId,user.id,user.role);

    return NextResponse.json(
      { message: "Article de stock supprimée avec succès" },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: {stockId:string, id: string } }
): Promise<NextResponse> {
  try {
    const user = getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non Authorisé" }, { status: 401 });
    }
    
    const {stockId,id}=params
    
    const updateData = await request.json();

    const updatedItem = await updateStockItem(
      id,stockId, user.hotelId,user.id,user.role,
      updateData
    );

    return NextResponse.json(
      { message: "Article de stock mis à jour avec succès" },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error);
  }
}
