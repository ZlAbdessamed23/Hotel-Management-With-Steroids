import { NextRequest, NextResponse } from "next/server";
// Adjust the import path as needed
import {
  AddEventSeanceData,
  requiredEventSeanceFields,
} from "@/app/api/main/event/seance/types";
import {
  addEventSeance,
  checkReceptionManagerReceptionistRole,
} from "@/app/api/main/event/seance/controller";

import { handleError } from "@/lib/error_handler/handleError";
import { getUser } from "@/lib/token/getUserFromToken";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const user = getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non Authorisé" }, { status: 401 });
    }
    console.log(user);
    checkReceptionManagerReceptionistRole(user.role);

    const data: AddEventSeanceData = await request.json();
    const missingFields = requiredEventSeanceFields.filter(
      (field) => !data[field]
    );
    if (missingFields.length > 0) {
      return NextResponse.json(
        { message: `${missingFields.join(", ")} sont requis` },
        { status: 400 }
      );
    }

    const newEventSeance = await addEventSeance(data, user.hotelId);

    return NextResponse.json(
      {
        message: `la séance ${newEventSeance.EventSeance.title} a été crée avec succès`,
      },
      { status: 201 }
    );
  } catch (error) {
    return handleError(error);
  }
}
