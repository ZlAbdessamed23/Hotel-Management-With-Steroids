import { NextResponse, NextRequest } from "next/server";
import { verifyResetCode } from "@/app/api/auth/password/resetCode/controller";
import { ResetCodeData, requiredResetCodeFields } from "@/app/api/auth/password/resetCode/types";
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
        maxAge: 60 * 60 * 24 * 7, // 30 minutes
        path: "/",
        secure: false,
        sameSite: "strict",
      });

     

      return response;
    
  } catch (error) {
    return handleError(error);
  }
}
