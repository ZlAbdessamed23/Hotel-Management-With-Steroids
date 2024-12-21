import { getUser } from "@/lib/token/getUserFromToken";
import { NextRequest, NextResponse } from "next/server";
import {
  checkRestaurantManagerChefRole,
  addCafeteriaMenuItem,
} from "@/app/api/main/food/cafeteria/item/controller";
import { handleError } from "@/lib/error_handler/handleError";
import {
  AddCafeteriaMenuItemData,
  requiredRestaurantMenuItemFields,
} from "@/app/api/main/food/cafeteria/item/types";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const user = getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non Authorisé" }, { status: 401 });
    }
  
    checkRestaurantManagerChefRole(user.role);

    const data: AddCafeteriaMenuItemData = await request.json();
    const missingFields = requiredRestaurantMenuItemFields.filter(
      (field) => !data[field]
    );
    if (missingFields.length > 0) {
      return NextResponse.json(
        { message: `${missingFields.join(", ")}:sont requis ` },
        { status: 400 }
      );
    }

    const createdMenuItem = await addCafeteriaMenuItem(data);

    return NextResponse.json(
      { message: "Article de la cafétéria crée avec succès" },
      { status: 201 }
    );
  } catch (error) {
    return handleError(error);
  }
}
