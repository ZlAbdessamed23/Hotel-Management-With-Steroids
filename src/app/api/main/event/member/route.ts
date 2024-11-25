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

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const user = getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non Authorisé" }, { status: 401 });
    }
    console.log(user);
    checkReceptionManagerReceptionistRole(user.role);

    const data: AddEventMemberData = await request.json();
    const missingFields = requiredEventMemberFields.filter(
      (field) => !data[field]
    );
    if (missingFields.length > 0) {
      return NextResponse.json(
        { message: `Missing required fields: ${missingFields.join(", ")}` },
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
