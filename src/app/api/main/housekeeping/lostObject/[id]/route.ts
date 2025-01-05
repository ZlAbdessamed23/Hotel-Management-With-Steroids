import { handleError } from "@/lib/error_handler/handleError";
import { getUser } from "@/lib/token/getUserFromToken";
import { NextRequest, NextResponse } from "next/server";
import { checkReceptionManagerReceptionistGvernementRole, deleteLostObjectById, updateLostObject } from "@/app/api/main/housekeeping/lostObject/[id]/controller";


export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const user = getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non Authorisé" }, { status: 401 });
    }
    checkReceptionManagerReceptionistGvernementRole(user.role);
    const lostObjectId = params.id;
    const updateData = await request.json();

    const updatedLostObject = await updateLostObject(
      lostObjectId,
      user.hotelId,
      updateData
    );

    return NextResponse.json({
      message: "Objet perdu mis à jour avec succès",
      LostObject: updatedLostObject
    }, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}


export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
  ): Promise<NextResponse> {
    try {
      const user = getUser(request);
      if (!user) {
        return NextResponse.json({ error: "Non Authorisé" }, { status: 401 });
      }
      
      checkReceptionManagerReceptionistGvernementRole(user.role);
  
      const LostObjectId = params.id;
      const deletedLostObject = await deleteLostObjectById(LostObjectId, user.hotelId);
  
      return NextResponse.json(
        { message: "LostObject supprimé avec succès" },
        { status: 200 }
      );
    } catch (error) {
      return handleError(error);
    }
  };