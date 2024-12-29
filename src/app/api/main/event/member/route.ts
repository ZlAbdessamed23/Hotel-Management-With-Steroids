import { NextRequest, NextResponse } from "next/server";
// Adjust the import path as needed
import {
  AddEventMemberData,
  requiredEventMemberFields,
  EventMemberResult,
} from "@/app/api/main/event/member/types";
import {
  addEventMember,
  checkReceptionManagerReceptionistRole,
} from "@/app/api/main/event/member/controller";

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

    const data: AddEventMemberData = await request.json();
    const missingFields = requiredEventMemberFields.filter(
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

    const reservation = await addEventMember(
      data,

      user.hotelId
    );

    return NextResponse.json(
      { message: "Membre crée avec succès" },
      { status: 201 }
    );
  } catch (error) {
    return handleError(error);
  }
}
