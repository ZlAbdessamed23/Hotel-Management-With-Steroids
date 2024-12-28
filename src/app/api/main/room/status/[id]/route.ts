import { NextRequest, NextResponse } from "next/server";
import {
  
  checkReceptionistReceptionManagerRole,
  
  updateRoomState,
} from "@/app/api/main/room/status/[id]/controller";
import { handleError } from "@/lib/error_handler/handleError";
import { UpdateRoomStateData } from "@/app/api/main/room/status/[id]/types";

import { getUser } from "@/lib/token/getUserFromToken";
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const user = getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non Authorisé" }, { status: 401 });
    }
    
    checkReceptionistReceptionManagerRole(user.role);
    console.log(await request.json())
    const roomId = params.id;
    const updateStateData: UpdateRoomStateData = await request.json();
    

    const updatedRoom = await updateRoomState(
      updateStateData,roomId,
      user.hotelId
    );

    return NextResponse.json({
      message : `la chambre ${updatedRoom.room.number + updatedRoom.room.type} a été mise à jour avec succès`
    }, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}
