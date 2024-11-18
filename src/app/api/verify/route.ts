import { NextRequest, NextResponse } from "next/server";
import { jwtVerify, JWTVerifyResult } from "jose";
import { UserRole } from "@prisma/client";

interface DecodedToken {
  id: string;
  role: UserRole[];
  endDate: Date;
  hotelId: string;
  iat: number;
  exp: number;
}

export async function GET(req: NextRequest) {
  try {
    const hotelToken = req.cookies.get("hotelToken")?.value;

    if (!hotelToken) {
      return NextResponse.json(
        { error: "hotel token not found" },
        { status: 401 }
      );
    }

    if (!process.env.JWT_HOTEL_SECRET) {
      throw new Error("JWT_HOTEL_SECRET is not defined");
    }

    const secret = new TextEncoder().encode(process.env.JWT_HOTEL_SECRET);

    const { payload } = (await jwtVerify(
      hotelToken,
      secret
    )) as JWTVerifyResult & { payload: DecodedToken };

    // Token is valid, you can use the decoded information
    const { id, role } = payload;

    // Here you can perform actions based on the verified token
    // For example, fetch user data from the database

    return NextResponse.json(
      {
        message: "Token verified successfully",
        user: payload,
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "JWTExpired") {
        // Token has expired
        return NextResponse.json({ error: "Token expired" }, { status: 401 });
      } else if (error.name === "JWTInvalid") {
        // Token verification failed
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
      }
    }
    // Other errors
    console.error("Error verifying token:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
