import { getUser } from "@/lib/token/getUserFromToken";
import { NextRequest, NextResponse } from "next/server";
import {
  checkRestaurantManagerChefRole,
  addCafeteriaMenuItem,
} from "@/app/api/main/food/cafeteria/item/controller";
import { handleError } from "@/lib/error_handler/handleError";
import {
  AddCafeteriaMenuItemData,
  requiredCafeteriaMenuItemFields,
} from "@/app/api/main/food/cafeteria/item/types";
import { TranslateObjKeysFromEngToFr } from "@/app/utils/translation";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const user = getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non Authorisé" }, { status: 401 });
    }
  
    checkRestaurantManagerChefRole(user.role);

    const data: AddCafeteriaMenuItemData = await request.json();
    const missingFields = requiredCafeteriaMenuItemFields.filter(
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

    const createdMenuItem = await addCafeteriaMenuItem(data);

    return NextResponse.json(
      { message: "Article de la cafétéria crée avec succès" },
      { status: 201 }
    );
  } catch (error) {
    return handleError(error);
  }
}
