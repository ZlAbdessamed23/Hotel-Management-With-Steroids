import { getUser } from "@/lib/token/getUserFromToken";
import { NextRequest, NextResponse } from "next/server";
import {
  checkReceptionistReceptionManagerRole,
  deleteReservation,
  getReservationById,
} from "@/app/api/main/client/reservation/[id]/controller";
import { handleError } from "@/lib/error_handler/handleError";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const user = getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non Authorisé" }, { status: 401 });
    }

    checkReceptionistReceptionManagerRole(user.role);

    const reservationId = params.id;
    const deletedReservation = await deleteReservation(
      reservationId,
      user.hotelId
    );

    return NextResponse.json(
      { message: "Reservation supprimé avec succès" },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error);
  }
}
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const user = getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non Authorisé" }, { status: 401 });
    }

    checkReceptionistReceptionManagerRole(user.role);

    const reservationId = params.id;
    const Reservation = await getReservationById(
      reservationId,
      user.hotelId
    );

    return NextResponse.json(
      Reservation,
      { status: 200 }
    );
  } catch (error) {
    return handleError(error);
  }
}

