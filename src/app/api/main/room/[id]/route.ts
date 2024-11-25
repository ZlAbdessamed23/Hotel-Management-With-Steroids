import { NextRequest, NextResponse } from "next/server";
import {
  checkReceptionistAdminRole,
  checkReceptionistRole,
  deleteRoomById,
  getRoomById,
  updateRoom,
} from "./controller";
import { handleError } from "@/lib/error_handler/handleError";
import { UpdateRoomData } from "./types";

import { getUser } from "@/lib/token/getUserFromToken";
/////////////////////// get room with id //////////////////////////////////
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const user = getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non Authorisé" }, { status: 401 });
    }
    console.log(user);
    checkReceptionistAdminRole(user.role);

    const roomId = params.id;
    const room = await getRoomById(roomId, user.hotelId);

    return NextResponse.json(room, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}
/////////////////////////////// delete Room //////////////////////////////////////////////
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const user = getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non Authorisé" }, { status: 401 });
    }
    console.log(user);
    checkReceptionistRole(user.role);

    const employeeId = params.id;
    const deletedEmployee = await deleteRoomById(employeeId, user.hotelId);

    return NextResponse.json(
      { message: "Chambre supprimé avec succès" },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error);
  }
}
//////////////////////// Update room ////////////////////////////
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const user = getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non Authorisé" }, { status: 401 });
    }
    console.log(user);
    checkReceptionistRole(user.role);

    const roomId = params.id;
    const updateData: UpdateRoomData = await request.json();

    const updatedRoom = await updateRoom(roomId, user.hotelId, updateData);

    return NextResponse.json(
      { message: "Chambre mis à jour avec succès" },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error);
  }
}
