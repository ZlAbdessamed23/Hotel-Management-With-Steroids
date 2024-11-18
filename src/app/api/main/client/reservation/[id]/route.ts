import { getUser } from "@/lib/token/getUserFromToken";
import { NextRequest, NextResponse } from "next/server";
import {
  checkReceptionistRole,
  deleteReservation,
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

    checkReceptionistRole(user.role);

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
