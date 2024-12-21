import { NextRequest, NextResponse } from "next/server";
import {
  
  checkReceptionistReceptionManagerAdminRole,
  
  getPendingClientResults,
} from "@/app/api/main/client/pendingClients/controller";

import { handleError } from "@/lib/error_handler/handleError";
import { getUser } from "@/lib/token/getUserFromToken";



export async function GET(request: NextRequest) {
  try {
    const user = getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non Authorisé" }, { status: 401 });
    }
   

    // Check if the user is either an admin or a receptionistReceptionManager
    checkReceptionistReceptionManagerAdminRole(user.role);

    const clientsWithReservations = await getPendingClientResults(
      user.hotelId
    );
    return NextResponse.json(clientsWithReservations, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}
