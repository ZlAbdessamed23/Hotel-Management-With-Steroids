import { NextRequest, NextResponse } from "next/server";
// Adjust the import path as needed
import {
  addRestaurantMenu,
  getAllRestaurantMenus,
 
} from "@/app/api/main/food/restaurant/menu/controller";
import { AddRestaurantMenuData, requiredRestaurantMenuFields } from "@/app/api/main/food/restaurant/menu/types";

import { handleError } from "@/lib/error_handler/handleError";
import { getUser } from "@/lib/token/getUserFromToken";
import { TranslateObjKeysFromEngToFr } from "@/app/utils/translation";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const user = getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non Authorisé" }, { status: 401 });
    }
   
    

    const data: AddRestaurantMenuData = await request.json();
    const missingFields = requiredRestaurantMenuFields.filter(
          (field) => !data[field]
        );
    
        if (missingFields.length > 0) {
          const translatedFields = missingFields.map(field => 
            TranslateObjKeysFromEngToFr(field)
          );
    
          return NextResponse.json(
            { message: `${translatedFields.join(", ")}: sont requis` },
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
   

    

    const RestaurantMenus = await getAllRestaurantMenus(user.hotelId);
    return NextResponse.json(RestaurantMenus, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}
