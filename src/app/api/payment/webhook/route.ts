import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "@/lib/prisma/prismaClient";

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      throw new Error("No Stripe signature found");
    }

    const event = verifyAndParseWebhook(body, signature);
    await handleWebhookEvent(event);

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    return handleWebhookError(error);
  }
}

function verifyAndParseWebhook(
  payload: string,
  signature: string
): Stripe.Event {
  try {
    return stripe.webhooks.constructEvent(payload, signature, endpointSecret);
  } catch (err) {
    console.error(
      `Webhook signature verification failed: ${(err as Error).message}`
    );
    throw new Error("Invalid webhook signature");
  }
}

async function handleWebhookEvent(event: Stripe.Event): Promise<void> {
  switch (event.type) {
    case "checkout.session.completed":
      await handleCheckoutSessionCompleted(
        event.data.object as Stripe.Checkout.Session
      );
      break;
    // Add more event types here as needed
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }
}

async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session
): Promise<void> {
  console.log(`Payment succeeded for session: ${session.id}`);

  if (
    !session.metadata?.hotelId ||
    typeof session.metadata.hotelId !== "string"
  ) {
    throw new Error("Invalid or missing hotelId in session metadata");
  }

  await updateSubscription(session.metadata.hotelId);
}

async function updateSubscription(hotelId: string): Promise<void> {
  const hotel = await prisma.hotel.findUnique({
    where: { id: hotelId },
    include: { subscription: { include: { plan: true } } },
  });

  if (!hotel || !hotel.subscription) {
    throw new Error(
      `Hotel with ID ${hotelId} not found or has no subscription`
    );
  }

  const { subscription } = hotel;
  const currentDate = new Date();
  const maxEndDate = new Date(
    Math.max(subscription.endDate.getTime(), currentDate.getTime())
  );
  const newEndDate = new Date(maxEndDate.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days

  await prisma.subscription.update({
    where: { id: subscription.id },
    data: { endDate: newEndDate },
  });

  console.log(
    `Subscription for Hotel ${hotelId} updated with new end date: ${newEndDate}`
  );
}

function handleWebhookError(error: unknown): NextResponse {
  const errorMessage =
    error instanceof Error ? error.message : "Unknown error occurred";
  console.error(`Webhook Error: ${errorMessage}`);
  return NextResponse.json({ error: errorMessage }, { status: 400 });
}




