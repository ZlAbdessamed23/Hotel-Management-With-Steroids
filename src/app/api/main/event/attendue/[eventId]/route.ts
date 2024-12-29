import { NextRequest, NextResponse } from "next/server";
// Adjust the import path as needed

import {
  getEventAttendees,
  checkReceptionManagerReceptionistAdminRole,
} from "@/app/api/main/event/attendue/[eventId]/controller";

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
    
    checkReceptionManagerReceptionistAdminRole(user.role);
    const { eventId } = params;

    const attendues = await getEventAttendees(eventId, user.hotelId);

    return NextResponse.json(attendues, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}
