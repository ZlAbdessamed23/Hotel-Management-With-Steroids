import { NextRequest, NextResponse } from "next/server";
// Adjust the import path as needed
import {
  addRestaurantMenu,
  getAllRestaurantMenus,
 
} from "./controller";
import { AddRestaurantMenuData, requiredRestaurantMenuFields } from "./types";

import { handleError } from "@/lib/error_handler/handleError";
import { getUser } from "@/lib/token/getUserFromToken";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const user = getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non Authorisé" }, { status: 401 });
    }
    console.log(user);
    

    const data: AddRestaurantMenuData = await request.json();
    const missingFields = requiredRestaurantMenuFields.filter(
      (field) => !data[field]
    );
    if (missingFields.length > 0) {
      return NextResponse.json(
        { message: `${missingFields.join(", ")}: sont requis ` },
        { status: 400 }
      );
    }

    const newRestaurantMenu = await addRestaurantMenu(data, user.hotelId,user.id,user.role);

    return NextResponse.json(
      { message: "Restaurant menu crée avec succès" },
      { status: 201 }
    );
  } catch (error) {
    return handleError(error);
  }
}
///////////////////////////// Get ////////////////////////////////////
export async function GET(request: NextRequest) {
  try {
    const user = getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non Authorisé" }, { status: 401 });
    }
    console.log(user);

    

    const RestaurantMenus = await getAllRestaurantMenus(user.hotelId);
    return NextResponse.json(RestaurantMenus, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}
