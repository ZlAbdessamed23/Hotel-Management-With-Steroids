import { getUser } from "@/lib/token/getUserFromToken";
import { NextRequest, NextResponse } from "next/server";
import {
  checkRestaurantManagerChefAdminRole,
  getAllCafeteriaMenuItems,
} from "./controller";
import { handleError } from "@/lib/error_handler/handleError";

export async function GET(
  request: NextRequest,
  { params }: { params: { cafeteriaMenuId: string } }
): Promise<NextResponse> {
  try {
    const user = getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non Authorisé" }, { status: 401 });
    }
    console.log(user);
    checkRestaurantManagerChefAdminRole(user.role);
    const { cafeteriaMenuId } = params;

    const cafeteriaMenuItems = await getAllCafeteriaMenuItems(
      cafeteriaMenuId,
      user.hotelId
    );

    return NextResponse.json(cafeteriaMenuItems, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}
