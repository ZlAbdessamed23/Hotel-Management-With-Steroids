import { NextRequest, NextResponse } from "next/server";
import {
  getCafeteriaMenuItemById,
  deleteCafeteriaMenuItem,
  updateCafeteriaMenuItem,
  checkRestaurantManagerChefAdminRole,
  checkRestaurantManagerChefRole,
} from "@/app/api/main/food/cafeteria/item/[cafeteriaMenuId]/[itemId]/controller";
import { handleError } from "@/lib/error_handler/handleError";
import { UpdateCafeteriaMenuItemData } from "@/app/api/main/food/cafeteria/item/[cafeteriaMenuId]/[itemId]/types";
import { getUser } from "@/lib/token/getUserFromToken";

/////////////////////// Get Cafeteria Menu Item //////////////////////////////////////
export async function GET(
  request: NextRequest,
  { params }: { params: { cafeteriaMenuId: string; itemId: string } }
): Promise<NextResponse> {
  try {
    const user = getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non Authorisé" }, { status: 401 });
    }
    
    checkRestaurantManagerChefAdminRole(user.role);

    const { cafeteriaMenuId, itemId } = params;
    const { cafeteriaMenuItem } = await getCafeteriaMenuItemById(
      cafeteriaMenuId,
      itemId,
      
    );

    return NextResponse.json(cafeteriaMenuItem, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}

/////////////////////////////// Delete Cafeteria Menu Item //////////////////////////////////////////////
export async function DELETE(
  request: NextRequest,
  { params }: { params: { cafeteriaMenuId: string; itemId: string } }
): Promise<NextResponse> {
  try {
    const user = getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non Authorisé" }, { status: 401 });
    }
    
    checkRestaurantManagerChefRole(user.role);

    const { cafeteriaMenuId, itemId } = params;
    const { cafeteriaMenuItem } = await deleteCafeteriaMenuItem(
      
      itemId,
      
    );

    return NextResponse.json(
      { message: "Article de la cafétéria supprimé avec succès" },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error);
  }
}

//////////////////////// Update Cafeteria Menu Item ////////////////////////////
export async function PATCH(
  request: NextRequest,
  { params }: { params: { cafeteriaMenuId: string; itemId: string } }
): Promise<NextResponse> {
  try {
    const user = getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non Authorisé" }, { status: 401 });
    }
    
    checkRestaurantManagerChefRole(user.role);

    const { cafeteriaMenuId, itemId } = params;
    const updateData: UpdateCafeteriaMenuItemData = await request.json();

    const { cafeteriaMenuItem } = await updateCafeteriaMenuItem(
      
      itemId,
     
      updateData
    );

    return NextResponse.json(
      { message: "Article de la cafétéria mis à jour avec succès" },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error);
  }
}
