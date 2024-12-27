import { NextRequest, NextResponse } from "next/server";
// Adjust the import path as needed
import {
  addCafeteriaMenu,
  getAllCafeteriaMenus,
 
} from "@/app/api/main/food/cafeteria/menu/controller";
import { AddCafeteriaMenuData, requiredCafeteriaMenuFields } from "@/app/api/main/food/cafeteria/menu/types";

import { handleError } from "@/lib/error_handler/handleError";
import { getUser } from "@/lib/token/getUserFromToken";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const user = getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non Authorisé" }, { status: 401 });
    }
    
    

    const data: AddCafeteriaMenuData = await request.json();
    const missingFields = requiredCafeteriaMenuFields.filter(
      (field) => !data[field]
    );
    if (missingFields.length > 0) {
      return NextResponse.json(
        { message: `${missingFields.join(", ")} sont requis` },
        { status: 400 }
      );
    }

    const newCafeteriaMenu = await addCafeteriaMenu(data, user.hotelId,user.id,user.role);

    return NextResponse.json(
      { message: "Cafétéria crée avec succès" },
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
    

    

    const CafeteriaMenus = await getAllCafeteriaMenus(user.hotelId);
    return NextResponse.json(CafeteriaMenus, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}
