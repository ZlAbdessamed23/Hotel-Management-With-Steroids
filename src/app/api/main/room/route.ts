import { NextRequest, NextResponse } from "next/server";
// Adjust the import path as needed
import {
  addRoom,
  checkReceptionistAdminRole,
  checkReceptionistRole,
  getAllRooms,
} from "./controller";
import { AddRoomData, requiredRoomFields } from "./types";

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

    const data: AddRoomData = await request.json();
    const missingFields = requiredRoomFields.filter((field) => !data[field]);
    if (missingFields.length > 0) {
      return NextResponse.json(
        { message: `${missingFields.join(", ")}: Missing required fields` },
        { status: 400 }
      );
    }

    const newRoom = await addRoom(data, user.hotelId);

    return NextResponse.json(
      { message: "Chambre crée avec succès" },
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

    const rooms = await getAllRooms(user.hotelId);
    return NextResponse.json(rooms, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}
