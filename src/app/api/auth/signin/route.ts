import { NextResponse, NextRequest } from "next/server";
import { signIn } from "@/app/api/auth/signin/controller";
import { SignInData } from "@/app/api/auth/signin/types";
import { handleError } from "@/lib/error_handler/handleError";
import { requiredSignInFields } from "@/app/api/auth/signin/types";
import { ValidationError } from "@/lib/error_handler/customerErrors";
import { TranslateObjKeysFromEngToFr } from "@/app/utils/translation";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const data: SignInData = await req.json();
    const missingFields = requiredSignInFields.filter(
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
        secure: false,
        sameSite: "strict",
      });

      return response;
    
  } catch (error) {
    return handleError(error);
  }
}


