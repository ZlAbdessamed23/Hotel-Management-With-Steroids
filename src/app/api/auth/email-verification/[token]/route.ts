import { NextRequest, NextResponse } from "next/server";
import { handleError } from "@/lib/error_handler/handleError";
import { verifyEmailToken, handleVerificationResult } from "./controller";

export async function GET(
  req: NextRequest,
  { params }: { params: { token: string } }
) {
  const { token } = params;

  if (!token) {
    return NextResponse.json(
      { message: "Un jeton de vérification est requis." },
      { status: 400 }
    );
  }

  try {
    const result = await verifyEmailToken(token);
    return handleVerificationResult(result);
  } catch (error) {
    return handleError(error);
  }
}
