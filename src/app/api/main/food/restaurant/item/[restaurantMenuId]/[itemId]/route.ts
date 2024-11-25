import { NextRequest, NextResponse } from "next/server";
import {
  getRestaurantMenuItemById,
  deleteRestaurantMenuItem,
  updateRestaurantMenuItem,
  checkRestaurantManagerChefAdminRole,
  checkRestaurantManagerChefRole,
} from "./controller";
import { handleError } from "@/lib/error_handler/handleError";
import { UpdateRestaurantMenuItemData } from "./types";
import { getUser } from "@/lib/token/getUserFromToken";

/////////////////////// Get Restaurant Menu Item //////////////////////////////////////
export async function GET(
  request: NextRequest,
  { params }: { params: { restaurantMenuId: string; itemId: string } }
): Promise<NextResponse> {
  try {
    const user = getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non Authorisé" }, { status: 401 });
    }
    console.log(user);
    checkRestaurantManagerChefAdminRole(user.role);

    const { restaurantMenuId, itemId } = params;
    const { restaurantMenuItem } = await getRestaurantMenuItemById(
      restaurantMenuId,
      itemId,
      user.hotelId
    );

    return NextResponse.json(restaurantMenuItem, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}

/////////////////////////////// Delete restaurant Menu Item //////////////////////////////////////////////
export async function DELETE(
  request: NextRequest,
  { params }: { params: { restaurantMenuId: string; itemId: string } }
): Promise<NextResponse> {
  try {
    const user = getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non Authorisé" }, { status: 401 });
    }
    console.log(user);
    checkRestaurantManagerChefRole(user.role);

    const { restaurantMenuId, itemId } = params;
    const { restaurantMenuItem } = await deleteRestaurantMenuItem(
      restaurantMenuId,
      itemId,
      user.hotelId
    );

    return NextResponse.json(
      { message: "Article de la restaurant supprimé avec succès" },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error);
  }
}

//////////////////////// Update Cafeteria Menu Item ////////////////////////////
export async function PATCH(
  request: NextRequest,
  { params }: { params: { restaurantMenuId: string; itemId: string } }
): Promise<NextResponse> {
  try {
    const user = getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non Authorisé" }, { status: 401 });
    }
    console.log(user);
    checkRestaurantManagerChefRole(user.role);

    const { restaurantMenuId, itemId } = params;
    const updateData: UpdateRestaurantMenuItemData = await request.json();

    const { restaurantMenuItem } = await updateRestaurantMenuItem(
      restaurantMenuId,
      itemId,
      user.hotelId,
      updateData
    );

    return NextResponse.json(
      { message: "Article de la restaurant mis à jour avec succès" },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error);
  }
}
