import { NextRequest, NextResponse } from "next/server";
import {
  addClientWithReservation,
  checkReceptionistReceptionManagerAdminRole,
  checkReceptionistReceptionManagerRole,
  getClientsWithReservations,
} from "@/app/api/main/client/client_with_reservation/controller";
import { ClientReservationData, requiredFields } from "@/app/api/main/client/client_with_reservation/types";
import { handleError } from "@/lib/error_handler/handleError";
import { getUser } from "@/lib/token/getUserFromToken";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const user = getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non Authorisé" }, { status: 401 });
    }
    checkReceptionistReceptionManagerRole(user.role);

    const data: ClientReservationData = await request.json();
    const missingFields = requiredFields.filter((field) => !data[field]);
    if (missingFields.length > 0) {
      return NextResponse.json(
        { message: `: ${missingFields.join(", ")} sont requis` },
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
  

    // Check if the user is either an admin or a receptionistReceptionManager
    checkReceptionistReceptionManagerAdminRole(user.role);

    const clientsWithReservations = await getClientsWithReservations(
      user.hotelId
    );
    return NextResponse.json(clientsWithReservations, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}
