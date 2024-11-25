import { getUser } from "@/lib/token/getUserFromToken";
import { NextRequest, NextResponse } from "next/server";
import { getAccessRestaurants } from "@/app/api/main/food/restaurant/restaurant/restaurantAccess/controller";
import { handleError } from "@/lib/error_handler/handleError";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const user = getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non Authorisé" }, { status: 401 });
    }
    console.log(user);

    const getRestaurants = await getAccessRestaurants(
      user.id,
      user.hotelId,
      user.role
    );

    return NextResponse.json(getRestaurants, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}
