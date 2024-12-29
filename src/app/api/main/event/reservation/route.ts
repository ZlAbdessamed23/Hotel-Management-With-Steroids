import { NextRequest, NextResponse } from "next/server";
// Adjust the import path as needed
import {
  CreateReservationWithAttendeeData,
  requiredAttendueReservationFields,
} from "@/app/api/main/event/reservation/types";
import {
  createReservationWithAttendee,
  checkReceptionManagerReceptionistRole,
} from "@/app/api/main/event/reservation/controller";

import { handleError } from "@/lib/error_handler/handleError";
import { getUser } from "@/lib/token/getUserFromToken";
import { TranslateObjKeysFromEngToFr } from "@/app/utils/translation";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const user = getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non Authorisé" }, { status: 401 });
    }
    console.log(user);
    checkReceptionManagerReceptionistRole(user.role);

    const data: CreateReservationWithAttendeeData = await request.json();
    const missingFields = requiredAttendueReservationFields.filter(
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

    const reservation = await createReservationWithAttendee(
      data,
      user.id,
      user.hotelId
    );

    return NextResponse.json(
      { message: "Reservation crée avec succès" },
      { status: 201 }
    );
  } catch (error) {
    return handleError(error);
  }
}
