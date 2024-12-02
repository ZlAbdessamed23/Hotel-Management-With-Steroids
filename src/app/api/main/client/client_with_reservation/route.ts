import { NextRequest, NextResponse } from "next/server";
import {
  addClientWithReservation,
  checkReceptionistAdminRole,
  checkReceptionistRole,
  getClientsWithReservations,
} from "./controller";
import { ClientReservationData, requiredFields } from "./types";
import { handleError } from "@/lib/error_handler/handleError";
import { getUser } from "@/lib/token/getUserFromToken";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const user = getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non Authorisé" }, { status: 401 });
    }
    checkReceptionistRole(user.role);

    const data: ClientReservationData = await request.json();
    const missingFields = requiredFields.filter((field) => !data[field]);
    if (missingFields.length > 0) {
      return NextResponse.json(
        { message: `: ${missingFields.join(", ")} est requis` },
        { status: 400 }
      );
    }

    const newClientReservation = await addClientWithReservation(
      data,
      user.hotelId,
      user.id
    );

    return NextResponse.json(
      { message: "Client avec reservation crée avec succès" },
      { status: 201 }
    );
  } catch (error) {
    return handleError(error);
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non Authorisé" }, { status: 401 });
    }
    console.log(user);

    // Check if the user is either an admin or a receptionist
    checkReceptionistAdminRole(user.role);

    const clientsWithReservations = await getClientsWithReservations(
      user.hotelId
    );
    return NextResponse.json(clientsWithReservations, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}
