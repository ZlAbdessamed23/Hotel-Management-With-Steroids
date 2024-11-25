import { NextRequest, NextResponse } from "next/server";
// Adjust the import path as needed
import {
  addEvent,
  getAllEvents,
  checkReceptionManagerReceptionistAdminRole,
  checkReceptionManagerReceptionistRole,
} from "./controller";
import { AddEventData, requiredEventFields } from "./types";

import { handleError } from "@/lib/error_handler/handleError";
import { getUser } from "@/lib/token/getUserFromToken";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const user = getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non Authorisé" }, { status: 401 });
    }
    console.log(user);
    checkReceptionManagerReceptionistRole(user.role);

    const data: AddEventData = await request.json();
    const missingFields = requiredEventFields.filter((field) => !data[field]);
    if (missingFields.length > 0) {
      return NextResponse.json(
        { message: `${missingFields.join(", ")} sont requis` },
        { status: 400 }
      );
    }

    const newEvent = await addEvent(data, user.hotelId);

    return NextResponse.json(
      { message: "Evenement crée avec succès" },
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
    checkReceptionManagerReceptionistAdminRole(user.role);

    const StockCategories = await getAllEvents(user.hotelId);
    return NextResponse.json(StockCategories, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}
