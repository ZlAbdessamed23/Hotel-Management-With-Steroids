import { getUser } from "@/lib/token/getUserFromToken";
import { NextRequest, NextResponse } from "next/server";
import {
  
  deleteStockCategory,
  getStockCategoryById,
  updateStockCategory,
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
    console.log(user);
   

    const {stockId,id} = params;
    const Category = await getStockCategoryById(stockId,id, user.hotelId,user.id,user.role);

    return NextResponse.json(Category, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { stockId:string,id: string  } }
): Promise<NextResponse> {
  try {
    const user = getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non Authorisé" }, { status: 401 });
    }
    console.log(user);
   

    const {stockId,id} = params;
    const deletedCategory = await deleteStockCategory(
      stockId,id, user.hotelId,user.id,user.role
    );

    return NextResponse.json(
      { message: "Category supprimée avec succès" },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { stockId:string,id: string } }
): Promise<NextResponse> {
  try {
    const user = getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non Authorisé" }, { status: 401 });
    }
   
    const {stockId,id} = params;
    const updateData = await request.json();

    const updatedCategory = await updateStockCategory(
      id, stockId, user.hotelId,user.id,user.role,
      updateData
    );

    return NextResponse.json(
      { message: "Category de stock mis à jour avec succès" },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error);
  }
}
