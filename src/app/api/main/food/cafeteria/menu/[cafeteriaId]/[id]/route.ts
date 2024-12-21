import { getUser } from "@/lib/token/getUserFromToken";
import { NextRequest, NextResponse } from "next/server";
import {
  
  deleteCafeteriaMenu,
  getCafeteriaMenuById,
  updateCafeteriaMenu,
} from "@/app/api/main/food/cafeteria/menu/[cafeteriaId]/[id]/controller";
import { handleError } from "@/lib/error_handler/handleError";
import { UpdateCafeteriaMenuData } from "@/app/api/main/food/cafeteria/menu/[cafeteriaId]/[id]/types";

export async function GET(
  request: NextRequest,
  { params }: { params: { cafeteriaId:string,id: string } }
): Promise<NextResponse> {
  try {
    const user = getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non Authorisé" }, { status: 401 });
    }
    
    

    const {id,cafeteriaId} = params;
    const menu = await getCafeteriaMenuById(id,cafeteriaId, user.hotelId,);

    return NextResponse.json(menu, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { cafeteriaId:string,id: string } }
): Promise<NextResponse> {
  try {
    const user = getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non Authorisé" }, { status: 401 });
    }
    
    

    const {id,cafeteriaId} = params;
    const deletedMenu = await deleteCafeteriaMenu(id,cafeteriaId, user.hotelId,);

    return NextResponse.json(
      { message: "Cafétéria supprimé avec succès" },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { cafeteriaId:string,id: string } }
): Promise<NextResponse> {
  try {
    const user = getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non Authorisé" }, { status: 401 });
    }
   
    const {id,cafeteriaId} = params;
    const updateData:UpdateCafeteriaMenuData = await request.json();

    const updatedMenu = await updateCafeteriaMenu(
      id,cafeteriaId, user.hotelId,
      updateData
    );

    return NextResponse.json(
      { message: "Cafétéria mis à jour avec succès" },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error);
  }
}
