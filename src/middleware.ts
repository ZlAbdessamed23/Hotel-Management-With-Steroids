// File: middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify, JWTVerifyResult } from "jose";
import {
  CustomError,
  UnauthorizedError,
  SubscriptionError,
  AuthenticationError,
} from "@/lib/error_handler/customerErrors";
import { handleError } from "@/lib/error_handler/handleError";
import { DecodedToken } from "./lib/token/decodedToken";
import { cookies } from "next/headers";


export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (pathname.startsWith("/main")) {
    const token = cookies().get("hotelToken")?.value;
    if (token) {
      try {
        const secret = new TextEncoder().encode(process.env.JWT_HOTEL_SECRET);
        const { payload } = await jwtVerify(token, secret) as JWTVerifyResult & {
          payload: DecodedToken;
        };

        if (pathname.includes("admin") && !payload.role.includes("admin")) {
          return NextResponse.redirect(new URL("/main", request.nextUrl));
        };

        if (pathname.includes("manager") && !(payload.role.includes("admin") || payload.role.includes("reception_Manager") || payload.role.includes("restaurent_Manager"))) {
          return NextResponse.redirect(new URL("/main", request.nextUrl));
        };

        if (pathname.includes("housekeeping") && !(payload.role.includes("admin") || payload.role.includes("reception_Manager") || payload.role.includes("gouvernante") || payload.role.includes("nettoyeur"))) {
          return NextResponse.redirect(new URL("/main", request.nextUrl));
        };

        if (pathname === "/main/profile") {
          if (payload.role.includes("admin")) {
            return NextResponse.redirect(new URL("/main/profile/admin", request.nextUrl));
          }
          else {
            return NextResponse.redirect(new URL("/main/profile/employee", request.nextUrl));
          };
        };

        if (pathname.includes("restauration") && !(payload.role.includes("admin") || payload.role.includes("restaurent_Manager"))) {
          return NextResponse.redirect(new URL("/main", request.nextUrl));
        };

        if (pathname.includes("stock") && !(payload.role.includes("admin") || payload.role.includes("stock_Manager") || payload.role.includes("reception_Manager"))) {
          return NextResponse.redirect(new URL("/main", request.nextUrl));
        };

        if (pathname.includes("reception")) {
          if (pathname.includes("gyms")) {
            if (!(payload.role.includes("entraineur") || payload.role.includes("receptionist") || payload.role.includes("reception_Manager") || payload.role.includes("admin"))) {
              return NextResponse.redirect(new URL("/main", request.nextUrl));
            };
          }
          else {
            if (!(payload.role.includes("receptionist") || payload.role.includes("reception_Manager") || payload.role.includes("admin"))) {
              return NextResponse.redirect(new URL("/main", request.nextUrl));
            };
          };
        };
      } catch (error) {
        return NextResponse.redirect(new URL("/login", request.nextUrl));
      };
    };
  };



  const token = request.cookies.get("hotelToken")?.value;

  if (!token) {
    return handleError(new AuthenticationError("Authentication required"));
  };

  try {
    const secret = new TextEncoder().encode(process.env.JWT_HOTEL_SECRET);
    const { payload } = (await jwtVerify(token, secret)) as JWTVerifyResult & {
      payload: DecodedToken;
    };

    // Check if token is expired
    if (Date.now() >= payload.exp * 1000) {
      throw new UnauthorizedError("Token has expired");
    };

    // Check if subscription has ended
    const subscriptionEndDate = new Date(payload.endDate);
    if (subscriptionEndDate < new Date()) {
      throw new SubscriptionError("Subscription has ended");
    };

    // Attach the user information to the request via headers
    const response = NextResponse.next();
    response.headers.set("x-user-data", JSON.stringify(payload));
    return response;
  } catch (error) {
    if (error instanceof CustomError) {
      return handleError(error);
    }
    if (error instanceof Error) {
      if (error.name === "JWTExpired") {
        return handleError(new UnauthorizedError("Token has expired"));
      } else if (error.name === "JWTInvalid") {
        return handleError(new AuthenticationError("Invalid token"));
      }
    }
    return handleError(new AuthenticationError("Invalid token"));
  }
}

export const config = {
  matcher: ["/api/main/:path*", "/main/:path*"]
};
