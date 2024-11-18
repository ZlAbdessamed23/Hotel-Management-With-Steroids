import { NextRequest, NextResponse } from "next/server";
import {
  checkAdminRole,
  deleteCalendar,
  getCalendarById,
  updateCalendar,
} from "@/app/api/main/calendar/[id]/controller";
import { handleError } from "@/lib/error_handler/handleError";
import { UpdateCalendarData } from "@/app/api/main/calendar/[id]/types";
import { getUser } from "@/lib/token/getUserFromToken";

/////////////////////// Get Cafeteria Menu Item //////////////////////////////////////
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const user = getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non Authorisé" }, { status: 401 });
    }
    console.log(user);

    const { id } = params;
    const Calendar = await getCalendarById(id, user.hotelId);

    return NextResponse.json(Calendar, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}

/////////////////////////////// Delete Cafeteria Menu Item //////////////////////////////////////////////
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const user = getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non Authorisé" }, { status: 401 });
    }
    console.log(user);
    checkAdminRole(user.role);

    const { id } = params;
    const Calendar = await deleteCalendar(id, user.hotelId);

    return NextResponse.json(
      { message: "Calendrier supprimé avec succès" },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error);
  }
}

//////////////////////// Update Cafeteria Menu Item ////////////////////////////
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const user = getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non Authorisé" }, { status: 401 });
    }
    console.log(user);
    checkAdminRole(user.role);

    const { id } = params;
    const updateData: UpdateCalendarData = await request.json();

    const Calendar = await updateCalendar(id, user.hotelId, updateData);

    return NextResponse.json(
      { message: "Calendrier mis à jour avec succès" },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error);
  }
}
