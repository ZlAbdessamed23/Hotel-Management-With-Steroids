import { NextRequest, NextResponse } from "next/server";
// Adjust the import path as needed
import {
  AddAttendueData,
  requiredAttendueFields,
} from "@/app/api/main/event/attendue/types";
import {
  addAttendue,
  checkReceptionManagerReceptionistRole,
} from "@/app/api/main/event/attendue/controller";

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

    const data: AddAttendueData = await request.json();
    const missingFields = requiredAttendueFields.filter(
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
    const newAttendue = await addAttendue(data, user.hotelId);

    return NextResponse.json(
      {
        message: "Invité crée avec succès",
      },
      { status: 201 }
    );
  } catch (error) {
    return handleError(error);
  }
}
