import { getUser } from "@/lib/token/getUserFromToken";
import { NextRequest, NextResponse } from "next/server";
import {
  checkReceptionManagerCoachAdminRole,
  getAllCoaches,
} from "@/app/api/main/sports_facility/coach/controller";
import { handleError } from "@/lib/error_handler/handleError";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const user = getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non Authorisé" }, { status: 401 });
    }
    
    checkReceptionManagerCoachAdminRole(user.role);
    const Coaches = await getAllCoaches(user.hotelId);
    return NextResponse.json(Coaches, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}
