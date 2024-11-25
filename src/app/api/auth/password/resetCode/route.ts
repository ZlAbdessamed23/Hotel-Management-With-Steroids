import { NextResponse, NextRequest } from "next/server";
import { verifyResetCode } from "./controller";
import { ResetCodeData, requiredResetCodeFields } from "./types";
import { handleError } from "@/lib/error_handler/handleError";
import { ValidationError } from "@/lib/error_handler/customerErrors";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const data: ResetCodeData = await req.json();
    const missingField = requiredResetCodeFields.find((field) => !data[field]);
    if (missingField) {
      throw new ValidationError(`${missingField} is required`);
    }

    const result = await verifyResetCode(data);

    if ("user" in result) {
      const { user, hotelToken } = result;
      const {
        password,
        resetCode,
        resetCodeExpiresAt,
        ...userWithoutSensitiveInfo
      } = user;
      const response = NextResponse.json(
        { message:`Bienvenu ${user.firstName + user.lastName}`,roles:user.role },
        { status: 200 }
      );

      response.cookies.set("hotelToken", hotelToken, {
        httpOnly: true,
        maxAge: 60 * 30, // 30 minutes
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
