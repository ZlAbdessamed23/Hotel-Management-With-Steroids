import { NextRequest, NextResponse } from "next/server";
// Adjust the import path as needed
import {
  addEvent,
  getAllEvents,
  checkReceptionManagerReceptionistAdminRole,
  checkReceptionManagerReceptionistRole,
} from "@/app/api/main/event/event/controller";
import { AddEventData, requiredEventFields } from "@/app/api/main/event/event/types";

import { handleError } from "@/lib/error_handler/handleError";
import { getUser } from "@/lib/token/getUserFromToken";
import { TranslateObjKeysFromEngToFr } from "@/app/utils/translation";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const user = getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non Authorisé" }, { status: 401 });
    }
    
    checkReceptionManagerReceptionistRole(user.role);

    const data: AddEventData = await request.json();
    const missingFields = requiredEventFields.filter(
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

    const newEvent = await addEvent(data, user.hotelId);

    return NextResponse.json(
      { message: "Evenement crée avec succès" },
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
    

    // Check if the user is either an admin or a receptionist
    checkReceptionManagerReceptionistAdminRole(user.role);

    const StockCategories = await getAllEvents(user.hotelId);
    return NextResponse.json(StockCategories, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}
