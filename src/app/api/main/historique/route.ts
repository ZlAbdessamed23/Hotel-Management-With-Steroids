import { NextRequest, NextResponse } from "next/server";
import {
  checkAdminRole,
  getAllClientsHistorique,
} from "@/app/api/main/historique/controller";
import { getUser } from "@/lib/token/getUserFromToken";
import { handleError } from "@/lib/error_handler/handleError";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const user = getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non Authorisé" }, { status: 401 });
    }

    checkAdminRole(user.role);
    const Historique = await getAllClientsHistorique(user.hotelId);
    return NextResponse.json(Historique, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}
