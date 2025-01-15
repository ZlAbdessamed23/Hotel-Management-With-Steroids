import prisma from "@/lib/prisma/prismaClient";
import { ForgetPasswordData, User } from "@/app/api/auth/password/forgetPassword/types";
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
    await sendResetCodeEmail(user.email, resetCode,user.firstName);
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
      await sendVerificationEmail(user.email, token,user.firstName);
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
  token: string,
  firstName: string
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
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link
              href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap"
              rel="stylesheet">
          <title>Email Verification</title>
      </head>
      
      <body style="font-family: Roboto;max-width: 600px; margin: auto; padding-top: 10px;">
          <div
              style="border: 2px solid rgb(212, 212, 212); border-radius: 15px; box-shadow: 2px 2px 8px rgba(170, 170, 170, 0.5);">
              <div style="text-align: center; padding-top: 16px">
                  <a href="http://104.154.75.47/"><img src="https://i.postimg.cc/FFSgdbv6/hotyverse.png" alt="hotyverse-logo-image" style="size: 3rem;"></a>
                  <h2 style="font-size: medium; font-weight: 500; letter-spacing: 5px;">Hoty Verse</h2>
                  <h1 style="font-size: x-large; font-weight: 700; letter-spacing: 1.2px;">Activer Votre Compte</h1>
              </div>
              <div style="height: 1px; width: 100%; background-color: #E8E6F6;"></div>
              <div style="padding-top: 10px;padding-right: 10px;padding-left: 40px;padding-bottom: 16px;">
                  <p style="font-size: medium;font-weight: 500;">Hey ${firstName},</p>
                  <p style="font-size: medium; font-weight: 400;">Activer votre compte par cet email. Cliquez simplement sur
                      le bouton ci-dessous et tout sera prêt. Si
                      vous
                      n'avez pas créé ce compte, veuillez ignorer cet e-mail.</p>
      
              </div>
              <div style="text-align: center; padding-bottom: 46px;">
              <a href="${verificationLink}"
                style="display: inline-block; width: 75%; height: 60px; border-radius: 8px; background-color: #3177FF; border: none; color: white; font-weight: 400; font-size: medium; text-align: center; line-height: 60px; text-decoration: none; transition: background-color 0.3s;">
                      Activer le Compte
                  </a>
              </div>
          </div>
          <div style="text-align: center;">
              <p style="width: 50%;margin: auto;font-size: medium;font-weight: 300;">
                  problèmes ou questions? contactez-nous à <span style="color: #001E3C;">hotyversedz@gmail.com</span>
              </p>
              <div>
                  <a href="http://104.154.75.47/"><img src="https://i.postimg.cc/FFSgdbv6/hotyverse.png" alt="hotyverse-logo-image" style="size: 3rem;"></a>
                  <p style="font-size: small; font-weight: 300; color: #001E3C;">2024 cloudy verse</p>
                  <p style="font-size: small; font-weight: 300; color: #001E3C;">Tous les droits sont réservés</p>
              </div>
          </div>
      </body>
      
      </html>
      `
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
  resetCode: string,
  firstName: string
): Promise<void> {
  try {
    await sendMail(
      email,
      "Password Reset Code",
      `Your password reset code is: ${resetCode}. This code will expire in 15 minutes.`,
      `<!DOCTYPE html>
      <html lang="en">
      
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link
              href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap"
              rel="stylesheet">
          <title>Mot de Passe Oublié</title>
      </head>
      
      <body style="font-family: Roboto;max-width: 600px; margin: auto; padding-top: 10px;">
          <div
              style="border: 2px solid rgb(212, 212, 212); border-radius: 15px; box-shadow: 2px 2px 8px rgba(170, 170, 170, 0.5);margin-bottom: 16px;">
              <div style="padding-top: 16px;text-align: center;">
                  <a href="http://104.154.75.47/"><img src="https://i.postimg.cc/FFSgdbv6/hotyverse.png" alt="hotyverse-logo-image" style="size: 3rem;"></a>
                  <h2 style="font-size: medium; font-weight: 500; letter-spacing: 5px;">Hoty Verse</h2>
                  <h1 style="font-size: x-large; font-weight: 700; letter-spacing: 1.2px;">Rénitialiser Votre Mot de Passe</h1>
              </div>
              <div style="height: 1px; width: 100%; background-color: #E8E6F6;"></div>
              <div style="padding-top: 10px;padding-right: 10px;padding-left: 40px;padding-bottom: 16px;">
                  <p style="font-size: medium;font-weight: 500;">Hey ${firstName},</p>
                  <p style="font-size: medium; font-weight: 400;">Copiez le code ci-dessous pour réinitialiser votre mot de passe. Si vous n'avez pas fait cette demande, ignorez cet e-mail</p>
              </div>
              <div style="padding-bottom: 46px; text-align: center;">
                  <table style="margin: 0 auto; border-spacing: 16px;">
                      <tr>
                          <td style="text-align: center;">
                              <span style="display: inline-block; height: 56px; width: 56px; border: 2px solid #020202; border-radius: 15px; line-height: 56px;">${resetCode[0]}</span>
                          </td>
                          <td style="text-align: center;">
                              <span style="display: inline-block; height: 56px; width: 56px; border: 2px solid #020202; border-radius: 15px; line-height: 56px;">${resetCode[1]}</span>
                          </td>
                          <td style="text-align: center;">
                              <span style="display: inline-block; height: 56px; width: 56px; border: 2px solid #020202; border-radius: 15px; line-height: 56px;">${resetCode[2]}</span>
                          </td>
                          <td style="text-align: center;">
                              <span style="display: inline-block; height: 56px; width: 56px; border: 2px solid #020202; border-radius: 15px; line-height: 56px;">${resetCode[3]}</span>
                          </td>
                          <td style="text-align: center;">
                              <span style="display: inline-block; height: 56px; width: 56px; border: 2px solid #020202; border-radius: 15px; line-height: 56px;">${resetCode[4]}</span>
                          </td>
                          <td style="text-align: center;">
                              <span style="display: inline-block; height: 56px; width: 56px; border: 2px solid #020202; border-radius: 15px; line-height: 56px;">${resetCode[5]}</span>
                          </td>
                      </tr>
                  </table>
              </div>
          </div>
          <div>
              <p style="width: 50%;text-align: center;font-size: medium;font-weight: 300;margin: auto;">
                  problèmes ou questions? contactez-nous à <span style="color: #001E3C;">hotyversedz@gmail.com</span>
              </p>
              <div style="text-align: center;">
                  <a href="http://104.154.75.47/"><img src="https://i.postimg.cc/FFSgdbv6/hotyverse.png" alt="hotyverse-logo-image" style="size: 3rem;"></a>
                  <p style="font-size: small; font-weight: 300; color: #001E3C;">2024 cloudy verse</p>
                  <p style="font-size: small; font-weight: 300; color: #001E3C;">Tous les droits sont réservés</p>
              </div>
          </div>
      </body>
      
      </html>`
    );
  } catch (error) {
    throwAppropriateError(error);
  }
}
