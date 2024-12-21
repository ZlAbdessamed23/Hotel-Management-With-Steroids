import prisma from "@/lib/prisma/prismaClient";
import bcrypt from "bcrypt";
import { generateVerificationToken } from "@/lib/third_party/email/generateVerificationToken";
import {
  AdminSignupData,
  AdminSignupResult,
} from "@/app/api/auth/signup/types";
import {
  ValidationError,
  NotFoundError,
  ConflictError,
  InternalServerError,
} from "@/lib/error_handler/customerErrors";
import { throwAppropriateError } from "@/lib/error_handler/throwError";
import { PrismaClient } from "@prisma/client";
import { sendMail } from "@/lib/third_party/email/sendMail";

export async function createAdmin(
  data: AdminSignupData
): Promise<AdminSignupResult> {
  try {
    return await prisma.$transaction(async (prisma) => {
      const { existingAdmin, existingPlan } = await validateAdminData(
        data,
        prisma
      );
      if (existingAdmin) {
        throw new ConflictError("Un administrateur avec cet email existe déja");
      }
      if (!existingPlan) {
        throw new NotFoundError("le plan n'est pas valide");
      }

      const hashedPassword = await hashPassword(data.password);
      const subscriptionData = getSubscriptionData(existingPlan.name);

      const createdAdmin = await createAdminWithHotel(
        data,
        hashedPassword,
        subscriptionData,
        prisma
      );
      const token = await createVerificationToken(createdAdmin.id, prisma);

      return { admin: createdAdmin, token };
    });
  } catch (error) {
    throwAppropriateError(error);
  }
}

async function validateAdminData(
  data: AdminSignupData,
  prisma: Omit<
    PrismaClient,
    "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
  >
) {
  const [existingAdmin, existingPlan] = await Promise.all([
    prisma.admin.findUnique({ where: { email: data.email } }),
    prisma.plan.findUnique({
      where: { name:data.planName },
      select: { name: true },
    }),
  ]);
  return { existingAdmin, existingPlan };
}

async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

function getSubscriptionData(planName: string): { endDate?: Date } {
  switch (planName) {
    case "Free":
      return {
        endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365 * 50), // 50 years
      };
    case "Premium":
      return {};
    case "Standard":
      return {
        endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days
      };
    default:
      throw new ValidationError(`le type de plan est non valide : ${planName}`);
  }
}

async function createAdminWithHotel(
  data: AdminSignupData,
  hashedPassword: string,
  subscriptionData: { endDate?: Date },
  prisma: Omit<
    PrismaClient,
    "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
  >
) {
  return await prisma.admin.create({
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      address: data.address,
      dateOfBirth: data.dateOfBirth,
      email: data.email,
      phoneNumber: data.phoneNumber,
      gender: data.gender,
      nationality: data.nationality,
      password: hashedPassword,
      hotel: {
        create: {
          hotelName:data.hotelName,
          hotelAddress: data.hotelAddress,
          country: data.country,
          hotelPhoneNumber: data.hotelPhoneNumber,
          hotelEmail: data.hotelEmail,
          cardNumber: data.cardNumber,
          subscription: {
            create: {
              plan: { connect: { name: data.planName } },
              ...subscriptionData,
            },
          },
        },
      },
    },
    include: {
      hotel: {
        include: {
          subscription: true,
        },
      },
    },
  });
}

async function createVerificationToken(
  adminId: string,
  prisma: Omit<
    PrismaClient,
    "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
  >
): Promise<string> {
  const token = generateVerificationToken(adminId);
  await prisma.emailVerificationToken.create({
    data: {
      token,
      adminId,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    },
  });
  return token;
}
/////////////////// send mail /////////////////
export async function sendVerificationEmail(
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
    
    throw new InternalServerError("Echec à l'envoie de l'email , réessayer plus tard");
  }
}