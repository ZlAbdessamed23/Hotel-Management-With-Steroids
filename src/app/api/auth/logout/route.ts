import { handleError } from "@/lib/error_handler/handleError";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    // Create a response that will be used to clear the cookie
    const response = NextResponse.json(
      {
        message: "Déconnexion réussie",
        redirectUrl: "http://localhost:3000/login",
      },
      { status: 200 }
    );

    // Clear the hotelToken cookie
    response.cookies.set("hotelToken", "", {
      httpOnly: true,
      maxAge: 0,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return response;
  } catch (error) {
    return handleError(error);
  }
}
