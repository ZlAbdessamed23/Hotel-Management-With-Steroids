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
                <p style="font-size: medium;font-weight: 500;">Hey Jack,</p>
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
}

async function generateToken(
  userId: string,
  hotelId: string,
  role: UserRole[],
  endDate: Date,
  planName: string
): Promise<string> {
  const secret = new TextEncoder().encode(process.env.JWT_HOTEL_SECRET);
  const token = await new SignJWT({ id: userId, hotelId, role, endDate, planName })
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

  if (plan.name === "Free") {
    return await generateUserTokens(admin);
  } else if (plan.name === "Standard" || plan.name === "Premium") {
    if (endDate < new Date()) {
      const redirectUrl = await createStripeCheckoutSession(plan, hotel.id);
      throw new SubscriptionError("Subscription has expired", { redirectUrl });
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

  if (plan?.name === "Free") {
    return await generateUserTokens(employee);
  } else if (plan?.name === "Standard" || plan?.name === "Premium") {
    if ((endDate as Date) < new Date()) {
      throw new SubscriptionError(
        "Votre limite d'abonnement est déja atteinte, votre administrateur doit renouveler l'abonnement pour que vous devez continuer",
      );
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
      user.hotel.subscription.endDate,
      user.hotel?.subscription?.plan.name as string,
    ),
  };
}

async function createStripeCheckoutSession(
  plan: Plan,
  hotelId: string
): Promise<string> {
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

    return session.url as string;
  } catch (error) {
    throw new PaymentError("Failed to create checkout session");
  }
}
