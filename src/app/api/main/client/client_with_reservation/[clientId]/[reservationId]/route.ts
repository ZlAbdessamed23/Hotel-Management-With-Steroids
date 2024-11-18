import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/token/getUserFromToken";
import { handleError } from "@/lib/error_handler/handleError";

import {
  updateClientAndReservation,
  checkReceptionistRole,
  checkReceptionistAdminRole,
  getClientWithReservations,
} from "./controller";
import { ClientReservationData } from "./types";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { clientId: string; reservationId: string } }
): Promise<NextResponse> {
  try {
    const user = getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non Authorisé" }, { status: 401 });
    }
    console.log(user);
    checkReceptionistRole(user.role);

    const { clientId, reservationId } = params;
    const updateData: ClientReservationData = await request.json();

    const updatedClientAndReservation = await updateClientAndReservation(
      clientId,
      reservationId,
      user.hotelId,
      updateData
    );

    return NextResponse.json(
      { message: "Client avec reservation mis à jour avec succès" },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error);
  }
}
////////////////////// get ////////////////////////////////////
export async function GET(
  request: NextRequest,
  { params }: { params: { clientId: string; reservationId: string } }
): Promise<NextResponse> {
  try {
    const user = getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non Authorisé" }, { status: 401 });
    }
    console.log(user);
    checkReceptionistAdminRole(user.role);

    const { clientId, reservationId } = params;

    const clientData = await getClientWithReservations(
      clientId,
      reservationId,
      user.hotelId
    );

    return NextResponse.json(clientData, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}
