import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { CustomError } from "@/lib/error_handler/customerErrors";

export function handleError(error: unknown): NextResponse {
  console.error("Error occurred:", error);

  if (error instanceof CustomError) {
    return NextResponse.json(
      {
        message: error.message,
        errorCode: error.errorCode,
        details: error.details,
      },
      { status: error.statusCode }
    );
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    console.error("Prisma error:", error.code, error.message);
    return NextResponse.json(
      {
        message: "Database operation failed. Please try again later.",
        errorCode: "DATABASE_ERROR",
        details: { prismaError: error.code },
      },
      { status: 500 }
    );
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    console.error("Prisma validation error:", error.message);
    return NextResponse.json(
      {
        message: "Invalid data provided for database operation.",
        errorCode: "DATABASE_VALIDATION_ERROR",
        details: { message: error.message },
      },
      { status: 400 }
    );
  }

  console.error("Unexpected error:", error);
  return NextResponse.json(
    {
      message: "An unexpected error occurred. Please try again later.",
      errorCode: "INTERNAL_SERVER_ERROR",
    },
    { status: 500 }
  );
}
