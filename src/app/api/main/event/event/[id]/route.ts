import { getUser } from "@/lib/token/getUserFromToken";
import { NextRequest, NextResponse } from "next/server";
import {
  checkReceptionManagerReceptionistRole,
  checkReceptionManagerReceptionistAdminRole,
  deleteEvent,
  getEventById,
  updateEvent,
} from "@/app/api/main/event/event/[id]/controller";
import { handleError } from "@/lib/error_handler/handleError";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const user = getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non Authorisé" }, { status: 401 });
    }
    
    checkReceptionManagerReceptionistAdminRole(user.role);

    const EventIdId = params.id;
    const Event = await getEventById(EventIdId, user.hotelId);

    return NextResponse.json(Event, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const user = getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non Authorisé" }, { status: 401 });
    }
    
    checkReceptionManagerReceptionistRole(user.role);

    const stockEventId = params.id;
    const deletedEvent = await deleteEvent(stockEventId, user.hotelId);

    return NextResponse.json({
      message : "Evenement supprimé avec succès"
    }, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const user = getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non Authorisé" }, { status: 401 });
    }
    checkReceptionManagerReceptionistRole(user.role);
    const stockEventId = params.id;
    const updateData = await request.json();

    const updatedEvent = await updateEvent(
      stockEventId,
      user.hotelId,
      updateData
    );

    return NextResponse.json({
      message : "Evenement mise à jour avec succès"
    }, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}
