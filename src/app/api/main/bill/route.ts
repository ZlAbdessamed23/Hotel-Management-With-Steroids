import { getUser } from "@/lib/token/getUserFromToken";
import { NextRequest, NextResponse } from "next/server";
import {
  
  getHotel,
} from "@/app/api/main/bill/controller";
import { handleError } from "@/lib/error_handler/handleError";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const user = getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non Authorisé" }, { status: 401 });
    }
    
    const Hotel = await getHotel(user.hotelId);
    return NextResponse.json(Hotel, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}
