import prisma from "@/lib/prisma/prismaClient";
import bcrypt from "bcrypt";
import Stripe from "stripe";
import { SignJWT } from "jose";
import { generateVerificationToken } from "@/lib/third_party/email/generateVerificationToken";
import { sendMail } from "@/lib/third_party/email/sendMail";
import {
  ValidationError,
  NotFoundError,
  UnauthorizedError,
  AccountNotActivatedError,
  PaymentError,
  SubscriptionError,
} from "@/lib/error_handler/customerErrors";
import {
  SignInData,
  SignInResult,
  User,
  Admin,
  Employee,
  requiredSignInFields,
} from "@/app/api/auth/signin/types";
import { throwAppropriateError } from "@/lib/error_handler/throwError";
import { UserRole, PrismaClient, Plan } from "@prisma/client";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function signIn(data: SignInData): Promise<SignInResult> {
  try {
    return await prisma.$transaction(async (prisma) => {
      const { existingUser } = await validateSignInData(data, prisma);

      await validatePassword(data.password, existingUser.password);
      await checkUserActivation(existingUser, data.collection);

      if (data.collection === "admin") {
        return await checkAdminSubscription(existingUser as Admin);
      } else if (data.collection === "employee") {
        return await checkEmployeeSubscription(existingUser as Employee);
      }

      throw new ValidationError("le role séléctionné est non valide");
    });
  } catch (error) {
    throwAppropriateError(error);
  }
}

async function validateSignInData(
  data: SignInData,
  prisma: Omit<
    PrismaClient,
    "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
  >
): Promise<{ existingUser: User }> {
  for (const field of requiredSignInFields) {
    if (!data[field]) {
      throw new ValidationError(`Champ obligatoire manquant : ${field}`);
    }
  }

  let existingUser: User | null = null;
  if (data.collection === "admin") {
    existingUser = await prisma.admin.findUnique({
      where: { email: data.email },
      include: {
        hotel: { include: { subscription: { include: { plan: true } } } },
      },
    });
  } else if (data.collection === "employee") {
    existingUser = await prisma.employee.findUnique({
      where: { email: data.email },
      include: {
        hotel: { include: { subscription: { include: { plan: true } } } },
      },
    });
  } else {
    throw new ValidationError("la collection donnée est non valide");
  }

  if (!existingUser) {
    throw new NotFoundError("utilisateur non trouvé");
  }

  return { existingUser };
}

async function validatePassword(
  inputPassword: string,
  storedPassword: string
): Promise<void> {
  const isPasswordValid = await bcrypt.compare(inputPassword, storedPassword);
  if (!isPasswordValid) {
    throw new UnauthorizedError("mot de passe non valide");
  }
}

async function checkUserActivation(
  user: User,
  collection: string
): Promise<void> {
  if (!user.isActivated) {
    const token = generateVerificationToken(user.id);
    await createVerificationToken(token, user.id, collection);
    await sendVerificationEmail(user.email, token);
    throw new AccountNotActivatedError(
      "Svp veuillez vérifier votre boite mail pour confimer l'action"
    );
  }
}

async function createVerificationToken(
  token: string,
  userId: string,
  collection: string
): Promise<void> {
  await prisma.emailVerificationToken.create({
    data: {
      token,
      ...(collection === "admin"
        ? { adminId: userId }
        : { employeeId: userId }),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
    },
  });
}

async function sendVerificationEmail(
  email: string,
  token: string
): Promise<void> {
  const verificationLink = `${process.env.BASE_URL}/${token}`;
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
}

async function generateToken(
  userId: string,
  hotelId: string,
  role: UserRole[],
  endDate: Date
): Promise<string> {
  const secret = new TextEncoder().encode(process.env.JWT_HOTEL_SECRET);
  const token = await new SignJWT({ id: userId, hotelId, role, endDate })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(secret);
  return token;
}

async function checkAdminSubscription(admin: Admin): Promise<SignInResult> {
  const { hotel } = admin;
  if (!hotel || !hotel.subscription) {
    throw new ValidationError("Hotel ou abonnement non trouvé");
  }

  const { plan, endDate } = hotel.subscription;

  if (plan.name === "FREE") {
    return await generateUserTokens(admin);
  } else if (plan.name === "STANDARD" || plan.name === "PREMIUM") {
    if (endDate < new Date()) {
      return await createStripeCheckoutSession(plan, hotel.id);
    } else {
      return await generateUserTokens(admin);
    }
  }

  throw new SubscriptionError("État d'abonnement inattendu");
}

async function checkEmployeeSubscription(
  employee: Employee
): Promise<SignInResult> {
  const { hotel } = employee;
  const subscription = hotel.subscription;
  const { plan, endDate } = subscription || {};

  if (plan?.name === "FREE") {
    return await generateUserTokens(employee);
  } else if (plan?.name === "STANDARD" || plan?.name === "PREMIUM") {
    if ((endDate as Date) < new Date()) {
      return {
        employeeMessage:
          "Votre limite d'abonnement est déja atteinte , votre administrateur doit renouveler l'abonnement pour que vous devez continuer ",
      };
    } else {
      return await generateUserTokens(employee);
    }
  }

  throw new SubscriptionError("État d'abonnement inattendu");
}

async function generateUserTokens(user: User): Promise<SignInResult> {
  if (!user.hotel) {
    throw new ValidationError("Les informations de l'hotel sont manquantes");
  }

  if (!user.hotel.subscription) {
    throw new ValidationError(
      "Les informations d'abonnement de l'hôtel sont manquantes"
    );
  }

  return {
    user,
    hotelToken: await generateToken(
      user.id,
      user.hotel.id,
      user.role,
      user.hotel.subscription.endDate
    ),
  };
}

async function createStripeCheckoutSession(
  plan: Plan,
  hotelId: string
): Promise<SignInResult> {
  try {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: `${plan.name} Plan` },
            unit_amount: plan.price * 100,
          },
          quantity: 1,
        },
      ],
      metadata: { hotelId },
      mode: "payment",
      shipping_address_collection: { allowed_countries: ["US", "BR"] },
      success_url: `https://www.google.com/`,
      cancel_url: `https://www.google.com/`,
    });

    return { redirectUrl: session.url as string };
  } catch (error) {
    throw new PaymentError("Failed to create checkout session");
  }
}
