import { getUser } from "@/lib/token/getUserFromToken";
import { NextRequest, NextResponse } from "next/server";
import { getAccessCafeterias } from "@/app/api/main/food/cafeteria/cafeteria/cafeteriaAccess/controller";
import { handleError } from "@/lib/error_handler/handleError";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const user = getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non Authorisé" }, { status: 401 });
    }
  

    const getCafeterias = await getAccessCafeterias(
      user.id,
      user.hotelId,
      user.role
    );

    return NextResponse.json(getCafeterias, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}
