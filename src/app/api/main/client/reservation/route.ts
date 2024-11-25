import { NextRequest, NextResponse } from "next/server";
import {
  addReservation,
  checkReceptionistAdminRole,
  checkReceptionistRole,
  getAllReservations,
} from "./controller";
import { AddReservationData, requiredReservationFields } from "./types";
import { handleError } from "@/lib/error_handler/handleError";
import { getUser } from "@/lib/token/getUserFromToken";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const user = getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non Authorisé" }, { status: 401 });
    }
    console.log(user);
    checkReceptionistRole(user.role);

    const data: AddReservationData = await request.json();
    const missingFields = requiredReservationFields.filter(
      (field) => !data[field]
    );
    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          message: `${missingFields.join(
            ","
          )} est requis pour ajouter une reservation`,
        },
        { status: 400 }
      );
    }

    const newReservation = await addReservation(data, user.hotelId, user.id);

    return NextResponse.json(
      { message: "Reservation crée avec succès" },
      { status: 201 }
    );
  } catch (error) {
    return handleError(error);
  }
}

///////////////////////////// Get ////////////////////////////////////
export async function GET(request: NextRequest) {
  try {
    const user = getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non Authorisé" }, { status: 401 });
    }
    console.log(user);

    // Check if the user is either an admin or a receptionist
    checkReceptionistAdminRole(user.role);

    const reservations = await getAllReservations(user.hotelId);
    return NextResponse.json(reservations, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}
