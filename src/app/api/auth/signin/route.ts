import { NextResponse, NextRequest } from "next/server";
import { signIn } from "@/app/api/auth/signin/controller";
import { SignInData } from "@/app/api/auth/signin/types";
import { handleError } from "@/lib/error_handler/handleError";
import { requiredSignInFields } from "@/app/api/auth/signin/types";
import { ValidationError } from "@/lib/error_handler/customerErrors";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const data: SignInData = await req.json();
    const missingField = requiredSignInFields.find((field) => !data[field]);
    if (missingField) {
      throw new ValidationError(`${missingField} est requis`);
    }

    const result = await signIn(data);

    
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
    
  } catch (error) {
    return handleError(error);
  }
}
