import { getUser } from "@/lib/token/getUserFromToken";
import { NextRequest, NextResponse } from "next/server";
import {
  checkRestaurantManagerChefRole,
  addRestaurantMenuItem,
} from "@/app/api/main/food/restaurant/item/controller";
import { handleError } from "@/lib/error_handler/handleError";
import {
  AddRestaurantMenuItemData,
  requiredRestaurantMenuItemFields,
} from "@/app/api/main/food/restaurant/item/types";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const user = getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non Authorisé" }, { status: 401 });
    }
    
    checkRestaurantManagerChefRole(user.role);

    const data: AddRestaurantMenuItemData = await request.json();
    const missingFields = requiredRestaurantMenuItemFields.filter(
      (field) => !data[field]
    );
    if (missingFields.length > 0) {
      return NextResponse.json(
        { message: `${missingFields.join(", ")}: sont requis ` },
        { status: 400 }
      );
    }
    const createdMenuItem = await addRestaurantMenuItem(data);

    return NextResponse.json(
      { message: "Article de la restaurant crée avec succès" },
      { status: 201 }
    );
  } catch (error) {
    return handleError(error);
  }
}
