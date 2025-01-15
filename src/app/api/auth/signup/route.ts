import { NextRequest, NextResponse } from "next/server";
import { AdminSignupData, requiredFields } from "./types";
import { handleError } from "@/lib/error_handler/handleError";
import {
  createAdmin,
  sendVerificationEmail,
} from "@/app/api/auth/signup/controller";
import { TranslateObjKeysFromEngToFr } from "@/app/utils/translation";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const data: AdminSignupData = await req.json();

    const missingFields = requiredFields.filter(
          (field) => !data[field]
        );
    
        if (missingFields.length > 0) {
          const translatedFields = missingFields.map(field => 
            TranslateObjKeysFromEngToFr(field)
          );
    
          return NextResponse.json(
            { message: `${translatedFields.join(", ")}: sont requis` },
            { status: 400 }
          );
        }
   
    const { admin, token } = await createAdmin(data);

    await sendVerificationEmail(admin.email, token,admin.firstName);

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
