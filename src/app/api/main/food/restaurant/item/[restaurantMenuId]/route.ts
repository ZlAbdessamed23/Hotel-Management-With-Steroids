import { getUser } from "@/lib/token/getUserFromToken";
import { NextRequest, NextResponse } from "next/server";
import {
  checkRestaurantManagerChefAdminRole,
  getAllRestaurantMenuItems,
} from "./controller";
import { handleError } from "@/lib/error_handler/handleError";

export async function GET(
  request: NextRequest,
  { params }: { params: { restaurantMenuId: string } }
): Promise<NextResponse> {
  try {
    const user = getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non Authorisé" }, { status: 401 });
    }
    console.log(user);
    checkRestaurantManagerChefAdminRole(user.role);
    const { restaurantMenuId } = params;

    const restaurantMenuItems = await getAllRestaurantMenuItems(
      restaurantMenuId,
      user.hotelId
    );

    return NextResponse.json(restaurantMenuItems, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}
