import { handleError } from "@/lib/error_handler/handleError";
import { getUser } from "@/lib/token/getUserFromToken";
import { NextRequest, NextResponse } from "next/server";
import { checkAdminReceptionGvernementRole, deleteLostObjectById } from "./controller";

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
      checkAdminReceptionGvernementRole(user.role);
  
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