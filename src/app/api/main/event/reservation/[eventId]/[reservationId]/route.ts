import { NextRequest, NextResponse } from "next/server";
// Adjust the import path as needed
import { ReservationUpdateData } from "@/app/api/main/event/reservation/[eventId]/[reservationId]/types";
import {
  updateReservation,
  checkReceptionManagerReceptionistRole,
} from "@/app/api/main/event/reservation/[eventId]/[reservationId]/controller";

import { handleError } from "@/lib/error_handler/handleError";
import { getUser } from "@/lib/token/getUserFromToken";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { eventId: string; reservationId: string } }
): Promise<NextResponse> {
  try {
    const user = getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non Authorisé" }, { status: 401 });
    }
    checkReceptionManagerReceptionistRole(user.role);
    const { eventId, reservationId } = params;
    const updateData: ReservationUpdateData = await request.json();

    const updatedEvent = await updateReservation(
      updateData,
      reservationId,
      user.hotelId
    );

    return NextResponse.json(
      { message: "Reservation mis à jour avec succès" },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error);
  }
}
