import { NextRequest, NextResponse } from "next/server";
import { AdminSignupData, requiredFields } from "./types";
import { handleError } from "@/lib/error_handler/handleError";
import {
  createAdmin,
  sendVerificationEmail,
} from "@/app/api/auth/signup/controller";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const data: AdminSignupData = await req.json();

    const missingField = requiredFields.find((field) => !data[field]);
    if (missingField) {
      return NextResponse.json(
        {
          message: `${missingField} est requis`,
        },
        { status: 400 }
      );
    }

    const { admin, token } = await createAdmin(data);

    await sendVerificationEmail(admin.email, token);

    return NextResponse.json(
      {
        message:
          "Votre compte Administrateur a été créer avec succès , veuillez vérifier votre boite mail pour terminer l'action",
      },
      { status: 201 }
    );
  } catch (error) {
    return handleError(error);
  }
}
//////send verification email
