import prisma from "@/lib/prisma/prismaClient";
import {
  ValidationError,
  NotFoundError,
  UnauthorizedError,
  InternalServerError,
  SubscriptionError,
  PaymentError,
} from "@/lib/error_handler/customerErrors";
import { SignJWT } from "jose";
import {
  ResetCodeData,
  ResetCodeResult,
  Admin,
  Employee,
  User,
  Plan,
} from "./types";
import Stripe from "stripe";
import { throwAppropriateError } from "@/lib/error_handler/throwError";
import { UserRole } from "@prisma/client";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function verifyResetCode(
  data: ResetCodeData
): Promise<ResetCodeResult> {
  try {
    const user = await findUser(data);
    await validateResetCode(user, data.resetCode);

    if (data.collection === "admin") {
      return await checkAdminSubscription(user as Admin);
    } else if (data.collection === "employee") {
      return await checkEmployeeSubscription(user as Employee);
    }

    throw new ValidationError("role est non valide");
  } catch (error) {
    throwAppropriateError(error);
  }
}

async function findUser(data: ResetCodeData): Promise<User> {
  try {
    let user;
    if (data.collection === "admin") {
      user = await prisma.admin.findUnique({
        where: { email: data.email },
        include: {
          hotel: { include: { subscription: { include: { plan: true } } } },
        },
      });
    } else if (data.collection === "employee") {
      user = await prisma.employee.findUnique({
        where: { email: data.email },
        include: {
          hotel: { include: { subscription: { include: { plan: true } } } },
        },
      });
    } else {
      throw new ValidationError("Le role séléctionné est non valide");
    }

    if (!user) {
      throw new NotFoundError("Utilisateur non trouvé");
    }

    return user;
  } catch (error) {
    throwAppropriateError(error);
  }
}

async function validateResetCode(
  user: User,
  resetCode: string
): Promise<Boolean> {
  try {
    if (!user.resetCode) {
      throw new ValidationError("Reset code non trouvé pour cet utilisateur");
    }

    if (user.resetCode !== resetCode) {
      throw new UnauthorizedError("Le code de reset est non valide");
    }

    if (!user.resetCodeExpiresAt) {
      throw new ValidationError("Reset code expiration date is missing");
    }

    if (user.resetCodeExpiresAt < new Date()) {
      throw new UnauthorizedError("Reset code a éxpirer");
    }

    // If we reach here, the reset code is valid and not expired
    return true;
  } catch (error) {
    throwAppropriateError(error);
  }
}

async function generateToken(
  userId: string,
  hotelId: string,
  role: UserRole[],
  endDate: Date
): Promise<string> {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_HOTEL_SECRET);

    const token = await new SignJWT({ id: userId, hotelId, role, endDate })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("7d")
      .sign(secret);

    return token;
  } catch (error) {
    throw new InternalServerError("Failed to generate access token");
  }
}

async function checkAdminSubscription(admin: Admin): Promise<ResetCodeResult> {
  try {
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

    throw new SubscriptionError("l'état de l'abonnemnt innatendu");
  } catch (error) {
    throwAppropriateError(error);
  }
}

async function checkEmployeeSubscription(
  employee: Employee
): Promise<ResetCodeResult> {
  try {
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

    throw new SubscriptionError("l'état de l'abonnemnt innatendu");
  } catch (error) {
    throwAppropriateError(error);
  }
}

async function generateUserTokens(user: User): Promise<ResetCodeResult> {
  try {
    if (!user.hotel) {
      throw new ValidationError("Les informations de l'hotel sont manquantes");
    }

    if (!user.hotel.subscription) {
      throw new ValidationError(
        "Les informations d'abonnement de l'hôtel sont manquantes"
      );
    }

    return {
      user: {
        ...user,
      },
      hotelToken: await generateToken(
        user.id,
        user.hotel.id,
        user.role,
        user.hotel.subscription.endDate
      ),
    };
  } catch (error) {
    throwAppropriateError(error);
  }
}

async function createStripeCheckoutSession(
  plan: Plan,
  hotelId: string
): Promise<ResetCodeResult> {
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
      success_url: `${process.env.BASE_URL}/subscription/success`,
      cancel_url: `${process.env.BASE_URL}/subscription/cancel`,
    });

    return { redirectUrl: session.url as string };
  } catch (error) {
    throw new PaymentError("error when we create session");
  }
}
