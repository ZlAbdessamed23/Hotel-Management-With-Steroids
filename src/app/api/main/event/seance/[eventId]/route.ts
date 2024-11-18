import { NextRequest, NextResponse } from "next/server";
// Adjust the import path as needed

import {
  getEventSeances,
  checkReceptionManagerReceptionistAdminRole,
} from "@/app/api/main/event/seance/[eventId]/controller";

import { handleError } from "@/lib/error_handler/handleError";
import { getUser } from "@/lib/token/getUserFromToken";

export async function GET(
  request: NextRequest,
  { params }: { params: { eventId: string } }
): Promise<NextResponse> {
  try {
    const user = getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non Authorisé" }, { status: 401 });
    }
    console.log(user);
    checkReceptionManagerReceptionistAdminRole(user.role);
    const { eventId } = params;

    const eventSeances = await getEventSeances(eventId, user.hotelId);

    return NextResponse.json(eventSeances, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}
