import { getUser } from "@/lib/token/getUserFromToken";
import { NextRequest, NextResponse } from "next/server";
import { getAccessDocuments } from "./controller";
import { handleError } from "@/lib/error_handler/handleError";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const user = getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non Authorisé" }, { status: 401 });
    }
    console.log(user);

    const documents = await getAccessDocuments(
      user.id,
      user.hotelId,
      user.role
    );

    return NextResponse.json(documents, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}
