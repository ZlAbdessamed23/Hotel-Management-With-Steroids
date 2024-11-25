import { NextRequest, NextResponse } from "next/server";
import {
  getCafeteriaMenuItemById,
  deleteCafeteriaMenuItem,
  updateCafeteriaMenuItem,
  checkRestaurantManagerChefAdminRole,
  checkRestaurantManagerChefRole,
} from "./controller";
import { handleError } from "@/lib/error_handler/handleError";
import { UpdateCafeteriaMenuItemData } from "./types";
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
    console.log(user);
    checkRestaurantManagerChefAdminRole(user.role);

    const { cafeteriaMenuId, itemId } = params;
    const { cafeteriaMenuItem } = await getCafeteriaMenuItemById(
      cafeteriaMenuId,
      itemId,
      user.hotelId
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
    console.log(user);
    checkRestaurantManagerChefRole(user.role);

    const { cafeteriaMenuId, itemId } = params;
    const { cafeteriaMenuItem } = await deleteCafeteriaMenuItem(
      cafeteriaMenuId,
      itemId,
      user.hotelId
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
    console.log(user);
    checkRestaurantManagerChefRole(user.role);

    const { cafeteriaMenuId, itemId } = params;
    const updateData: UpdateCafeteriaMenuItemData = await request.json();

    const { cafeteriaMenuItem } = await updateCafeteriaMenuItem(
      cafeteriaMenuId,
      itemId,
      user.hotelId,
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
