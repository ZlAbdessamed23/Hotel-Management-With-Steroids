import { handleError } from "@/lib/error_handler/handleError";
import { getUser } from "@/lib/token/getUserFromToken";
import { NextRequest, NextResponse } from "next/server";
import { checkReceptionManagerReceptionistGouvernementAdminRole, getAllHouseKeeping } from "./controller";

export async function GET(
    request: NextRequest,
   
  ): Promise<NextResponse> {
    try {
      const user = getUser(request);
      if (!user) {
        return NextResponse.json({ error: "Non Authorisé" }, { status: 401 });
      };
      checkReceptionManagerReceptionistGouvernementAdminRole(user.role);
      
      const HouseKeeping = await getAllHouseKeeping(user.hotelId);
  
      return NextResponse.json(HouseKeeping, { status: 201 });
    } catch (error) {
      return handleError(error);
    };
  }