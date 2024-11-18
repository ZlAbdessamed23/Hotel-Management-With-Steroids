import { handleError } from "@/lib/error_handler/handleError";
import { getUser } from "@/lib/token/getUserFromToken";
import { NextRequest, NextResponse } from "next/server";
import { getAllRestaurantMenus } from "./controller";

export async function GET(request: NextRequest,{ params }: { params: { restaurantId:string } }) {
    try {
      const user = getUser(request);
      if (!user) {
        return NextResponse.json({ error: "Non Authorisé" }, { status: 401 });
      }
      console.log(user);
  
      const {restaurantId}=params
  
      const RestaurantMenus = await getAllRestaurantMenus(restaurantId,user.hotelId,user.id,user.role);
      return NextResponse.json(RestaurantMenus, { status: 200 });
    } catch (error) {
      return handleError(error);
    }
  }