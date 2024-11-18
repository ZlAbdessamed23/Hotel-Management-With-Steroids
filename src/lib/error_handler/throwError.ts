import {
  CustomError,
  InternalServerError,
} from "@/lib/error_handler/customerErrors";
import { Prisma } from "@prisma/client";

export function throwAppropriateError(error: unknown): never {
  console.error(`Error`, error);

  if (error instanceof CustomError) {
    throw error;
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    console.error("Prisma known request error:", error.code, error.message);
    throw error;
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    console.error("Prisma validation error:", error.message);
    throw error;
  }

  if (error instanceof Error) {
    throw new InternalServerError(`Unexpected error: ${error.message}`);
  }

  throw new InternalServerError(`Unknown error occurred `);
}
