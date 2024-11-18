import { NextRequest, NextResponse } from "next/server";
import {
  checkReceptionManagerReceptionistAdminRole,
  checkReceptionManagerReceptionistRole,
  deleteEventSeance,
  getEventSeanceById,
  updateEventSeance,
} from "@/app/api/main/event/seance/[eventId]/[seanceId]/controller";
import { handleError } from "@/lib/error_handler/handleError";
import { UpdateEventSeanceData } from "@/app/api/main/event/seance/[eventId]/[seanceId]/types";
import { getUser } from "@/lib/token/getUserFromToken";

/////////////////////// Get Cafeteria Menu Item //////////////////////////////////////
export async function GET(
  request: NextRequest,
  { params }: { params: { eventId: string; seanceId: string } }
): Promise<NextResponse> {
  try {
    const user = getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non Authorisé" }, { status: 401 });
    }
    console.log(user);
    checkReceptionManagerReceptionistAdminRole(user.role);

    const { eventId, seanceId } = params;
    const EventSeance = await getEventSeanceById(
      eventId,
      seanceId,
      user.hotelId
    );

    return NextResponse.json(EventSeance, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}

/////////////////////////////// Delete Cafeteria Menu Item //////////////////////////////////////////////
export async function DELETE(
  request: NextRequest,
  { params }: { params: { eventId: string; seanceId: string } }
): Promise<NextResponse> {
  try {
    const user = getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non Authorisé" }, { status: 401 });
    }
    console.log(user);
    checkReceptionManagerReceptionistRole(user.role);

    const { eventId, seanceId } = params;
    const EventSeance = await deleteEventSeance(
      eventId,
      seanceId,
      user.hotelId
    );

    return NextResponse.json(
      {
        message: `la séance ${EventSeance.EventSeance.title} a été supprimé avec succès`,
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
  { params }: { params: { eventId: string; seanceId: string } }
): Promise<NextResponse> {
  try {
    const user = getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non Authorisé" }, { status: 401 });
    }
    console.log(user);
    checkReceptionManagerReceptionistRole(user.role);

    const { eventId, seanceId } = params;
    const updateData: UpdateEventSeanceData = await request.json();

    const seance = await updateEventSeance(
      eventId,
      seanceId,
      user.hotelId,
      updateData
    );

    return NextResponse.json(
      { message: "Seance mis à jour avec succès" },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error);
  }
}
