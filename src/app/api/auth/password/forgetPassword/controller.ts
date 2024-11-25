import prisma from "@/lib/prisma/prismaClient";
import { ForgetPasswordData, User } from "./types";
import {
  ValidationError,
  NotFoundError,
  AccountNotActivatedError,
} from "@/lib/error_handler/customerErrors";
import { sendMail } from "@/lib/third_party/email/sendMail";
import { generateVerificationToken } from "@/lib/third_party/email/generateVerificationToken";
import { throwAppropriateError } from "@/lib/error_handler/throwError";

export async function forgetPassword(data: ForgetPasswordData): Promise<void> {
  try {
    const user = await findUser(data);
    await checkUserActivation(user, data.collection);
    const resetCode = generateResetCode();
    const resetCodeExpiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes from now

    await updateUserResetCode(
      user.id,
      data.collection,
      resetCode,
      resetCodeExpiresAt
    );
    await sendResetCodeEmail(user.email, resetCode);
  } catch (error) {
    throwAppropriateError(error);
  }
}

async function updateUserResetCode(
  userId: string,
  collection: string,
  resetCode: string,
  resetCodeExpiresAt: Date
): Promise<void> {
  try {
    if (collection === "admin") {
      await prisma.admin.update({
        where: { id: userId },
        data: { resetCode, resetCodeExpiresAt },
      });
    } else if (collection === "employee") {
      await prisma.employee.update({
        where: { id: userId },
        data: { resetCode, resetCodeExpiresAt },
      });
    } else {
      throw new ValidationError("Le role séléctionné est non valide");
    }
  } catch (error) {
    throwAppropriateError(error);
  }
}

async function findUser(data: ForgetPasswordData): Promise<User> {
  try {
    let user;
    if (data.collection === "admin") {
      user = await prisma.admin.findUnique({
        where: { email: data.email },
      });
    } else if (data.collection === "employee") {
      user = await prisma.employee.findUnique({ where: { email: data.email } });
    } else {
      throw new ValidationError("Le role séléctionné est non valide");
    }

    if (!user) {
      throw new NotFoundError("utilisateur non trouvé");
    }

    return user;
  } catch (error) {
    throwAppropriateError(error);
  }
}

async function checkUserActivation(
  user: any,
  collection: string
): Promise<void> {
  if (!user.isActivated) {
    try {
      const token = generateVerificationToken(user.id);
      await createVerificationToken(token, user.id, collection);
      await sendVerificationEmail(user.email, token);
      throw new AccountNotActivatedError(
        "Svp , veuillez vérifier votre boite mail pour activer le compte"
      );
    } catch (error) {
      throwAppropriateError(error);
    }
  }
}

async function createVerificationToken(
  token: string,
  userId: string,
  collection: string
): Promise<void> {
  try {
    await prisma.emailVerificationToken.create({
      data: {
        token,
        ...(collection === "admin"
          ? { adminId: userId }
          : { employeeId: userId }),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
      },
    });
  } catch (error) {
    throwAppropriateError(error);
  }
}

async function sendVerificationEmail(
  email: string,
  token: string
): Promise<void> {
  const verificationLink = `${process.env.BASE_URL}/${token}`;
  try {
    await sendMail(
      email,
      "Verify Your Email",
      `Please verify your email by clicking on this link: ${verificationLink}`,
      `<!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify Your Email</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #f3f4f6; border-radius: 8px; padding: 20px; text-align: center;">
              <h1 style="color: #1a202c; font-size: 24px; margin-bottom: 20px;">Verify Your Email</h1>
              <p style="margin-bottom: 20px;">Thank you for signing up! Please verify your email address to complete your registration.</p>
              <a href="${verificationLink}" style="background-color: #3b82f6; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 4px; font-weight: bold;">Verify Email</a>
              <p style="margin-top: 20px; font-size: 14px; color: #4b5563;">If the button above doesn't work, you can also click on this link:</p>
              <a href="${verificationLink}" style="color: #3b82f6; word-break: break-all;">${verificationLink}</a>
          </div>
      </body>
      </html>`
    );
  } catch (error) {
    throwAppropriateError(error);
  }
}

function generateResetCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendResetCodeEmail(
  email: string,
  resetCode: string
): Promise<void> {
  try {
    await sendMail(
      email,
      "Password Reset Code",
      `Your password reset code is: ${resetCode}. This code will expire in 15 minutes.`,
      `<p>Your password reset code is: <strong>${resetCode}</strong>. This code will expire in 15 minutes.</p>`
    );
  } catch (error) {
    throwAppropriateError(error);
  }
}
