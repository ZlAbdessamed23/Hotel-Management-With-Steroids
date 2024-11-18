import crypto from "crypto";
import { InternalServerError } from "@/lib/error_handler/customerErrors";

export function generateVerificationToken(userId: string): string {
  const timestamp = Date.now().toString();
  const randomPart = crypto.randomBytes(20).toString("hex");
  const secretKey = process.env.VERIFICATION_SECRET_KEY as string;

  if (!secretKey) {
    throw new InternalServerError(
      "VERIFICATION_SECRET_KEY environment variable is not set"
    );
  }

  const dataToHash = `${userId}:${randomPart}:${timestamp}:${secretKey}`;
  const hash = crypto.createHash("sha256").update(dataToHash).digest("hex");

  return hash.slice(0, 32);
}
