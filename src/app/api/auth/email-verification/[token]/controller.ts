import prisma from "@/lib/prisma/prismaClient";
import { EmailVerificationResult } from "./types";
import { NextResponse } from "next/server";
import { VerificationError } from "@/lib/error_handler/customerErrors";
export async function verifyEmailToken(
  token: string
): Promise<EmailVerificationResult> {
  return prisma.$transaction(async (prisma) => {
    const verificationToken = await prisma.emailVerificationToken.findUnique({
      where: { token },
    });

    if (!verificationToken) {
      return { status: "invalid" };
    }

    if (verificationToken.expiresAt < new Date(Date.now())) {
      await prisma.emailVerificationToken.delete({ where: { token } });
      return { status: "expired" };
    }
    if (!verificationToken.adminId && !verificationToken.employeeId) {
      return { status: "invalid" };
    }
    let user;
    if (verificationToken.adminId) {
      user = await prisma.admin.update({
        where: { id: verificationToken.adminId as string },
        data: { isActivated: true },
      });
    } else {
      user = await prisma.employee.update({
        where: { id: verificationToken.employeeId as string },
        data: { isActivated: true },
      });
    }

    await prisma.emailVerificationToken.delete({ where: { token } });

    return { status: "success", user };
  });
}
export function handleVerificationResult(
  result: EmailVerificationResult
): NextResponse {
  switch (result.status) {
    case "invalid":
      throw new VerificationError("Jeton de vérification invalide", 400);
    case "expired":
      throw new VerificationError(
        "Le jeton de vérification a expiré. Veuillez en demander un nouveau.",
        400
      );
    case "success":
      return NextResponse.redirect(new URL("/login", "http://10.128.0.5"));
  }
}
