import { NextResponse, NextRequest } from "next/server";
import { signIn } from "./controller";
import { SignInData } from "./types";
import { handleError } from "@/lib/error_handler/handleError";
import { requiredSignInFields } from "./types";
import { ValidationError } from "@/lib/error_handler/customerErrors";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const data: SignInData = await req.json();
    const missingField = requiredSignInFields.find((field) => !data[field]);
    if (missingField) {
      throw new ValidationError(`${missingField} is required`);
    }

    const result = await signIn(data);

    if ("user" in result) {
      const { user, hotelToken } = result;
      
      const response = NextResponse.json(
        {message:`Bienvenu ${user.firstName + user.lastName}`,roles:user.role},
        { status: 200 }
      );

      

      response.cookies.set("hotelToken", hotelToken, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      return response;
    } else if ("redirectUrl" in result) {
      const { redirectUrl } = result;
      return NextResponse.json({ redirectUrl }, { status: 200 });
    } else {
      const { employeeMessage } = result;
      return NextResponse.json({ employeeMessage }, { status: 200 });
    }
  } catch (error) {
    return handleError(error);
  }
}
