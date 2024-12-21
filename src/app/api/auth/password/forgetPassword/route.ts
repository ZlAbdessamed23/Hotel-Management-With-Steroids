import { NextRequest, NextResponse } from "next/server";
import { forgetPassword } from "@/app/api/auth/password/forgetPassword/controller";
import { handleError } from "@/lib/error_handler/handleError";
import { ForgetPasswordData, requiredForgetPasswordFields } from "@/app/api/auth/password/forgetPassword/types";
import { ValidationError } from "@/lib/error_handler/customerErrors";

export async function POST(req: NextRequest) {
  try {
    const data: ForgetPasswordData = await req.json();
    const missingField = requiredForgetPasswordFields.find(
      (field) => !data[field]
    );
    if (missingField) {
      throw new ValidationError(`${missingField} est requis`);
    }

    await forgetPassword(data);
    return NextResponse.json({message:"Un Code a été envoyé à ton boite mail éléctronique"}, {
      status: 200,
    });
  } catch (error) {
    return handleError(error);
  }
}
