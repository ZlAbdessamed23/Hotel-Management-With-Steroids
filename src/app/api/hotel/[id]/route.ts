import { getUser } from "@/lib/token/getUserFromToken";
import { NextRequest, NextResponse } from "next/server";
import { getHotel } from "@/app/api/hotel/[id]/controller";
import { handleError } from "@/lib/error_handler/handleError";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const hotelId = params.id;
    const Hotel = await getHotel(hotelId);
    return NextResponse.json(Hotel, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}
