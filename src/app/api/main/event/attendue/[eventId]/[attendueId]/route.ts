import { NextRequest, NextResponse } from "next/server";
import {
  checkReceptionManagerReceptionistAdminRole,
  checkReceptionManagerReceptionistRole,
  deleteAttendue,
  getAttendueById,
  updateAttendue,
} from "@/app/api/main/event/attendue/[eventId]/[attendueId]/controller";
import { handleError } from "@/lib/error_handler/handleError";
import { UpdateAttendueData } from "@/app/api/main/event/attendue/[eventId]/[attendueId]/types";
import { getUser } from "@/lib/token/getUserFromToken";

/////////////////////// Get Cafeteria Menu Item //////////////////////////////////////
export async function GET(
  request: NextRequest,
  { params }: { params: { eventId: string; attendueId: string } }
): Promise<NextResponse> {
  try {
    const user = getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non Authorisé" }, { status: 401 });
    }
    console.log(user);
    checkReceptionManagerReceptionistAdminRole(user.role);

    const { eventId, attendueId } = params;
    const Attendue = await getAttendueById(eventId, attendueId, user.hotelId);

    return NextResponse.json(Attendue, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}

/////////////////////////////// Delete Cafeteria Menu Item //////////////////////////////////////////////
export async function DELETE(
  request: NextRequest,
  { params }: { params: { eventId: string; attendueId: string } }
): Promise<NextResponse> {
  try {
    const user = getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non Authorisé" }, { status: 401 });
    }
    console.log(user);
    checkReceptionManagerReceptionistRole(user.role);

    const { eventId, attendueId } = params;
    const Attendue = await deleteAttendue(eventId, attendueId, user.hotelId);

    return NextResponse.json(
      {
        message: "Invité supprimé avec succès",
      },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error);
  }
}

//////////////////////// Update Cafeteria Menu Item ////////////////////////////
export async function PATCH(
  request: NextRequest,
  { params }: { params: { eventId: string; attendueId: string } }
): Promise<NextResponse> {
  try {
    const user = getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non Authorisé" }, { status: 401 });
    }
    console.log(user);
    checkReceptionManagerReceptionistRole(user.role);

    const { eventId, attendueId } = params;
    const updateData: UpdateAttendueData = await request.json();

    const Attendue = await updateAttendue(
      eventId,
      attendueId,
      user.hotelId,
      updateData
    );

    return NextResponse.json(
      {
        message: "Invité mise a jour avec succès",
      },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error);
  }
}
