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


const freePlanRoutes = [
  "reception/manageclients", "reception/managerooms", "admin/manageemployees", "reception/housekeeping", "managenotes", "/profile","/main"
];

const routeAccess = {
  admin: ["admin"],
  manager: ["admin", "reception_Manager", "restaurent_Manager"],
  housekeeping: ["admin", "reception_Manager", "gouvernante", "nettoyeur"],
  restauration: ["admin", "restaurent_Manager"],
  stock: ["admin", "stock_Manager", "reception_Manager"],
  reception: ["receptionist", "reception_Manager", "admin"],
  gyms: ["entraineur", "receptionist", "reception_Manager", "admin"],
} as const;

// Helper function to check role access
const hasAccess = (userRoles: string[], requiredRoles: readonly string[]): boolean => {
  return userRoles.some(role => requiredRoles.includes(role));
};

// Handle profile redirects
const handleProfile = (payload: DecodedToken, request: NextRequest) => {
  const profileType = payload.role.includes("admin") ? "admin" : "employee";
  return NextResponse.redirect(new URL(`/main/profile/${profileType}`, request.nextUrl));
};

// Main route checker function
const checkRouteAccess = (pathname: string, payload: DecodedToken, request: NextRequest) => {
  // Early return for free plan restrictions
  if (payload.planName !== "Premium" && payload.planName !== "Standard") {
    const isFreePlanRoute = freePlanRoutes.some(route => pathname.includes(route));
    if (!isFreePlanRoute) {
      return NextResponse.redirect(new URL("/main", request.nextUrl));
    }
  }

  // Handle profile redirect
  if (pathname === "/main/profile") {
    return handleProfile(payload, request);
  }

  // Check path-based permissions
  if (pathname.includes("admin") && !hasAccess(payload.role, routeAccess.admin)) {
    return NextResponse.redirect(new URL("/main", request.nextUrl));
  }

  if (pathname.includes("manager") && !hasAccess(payload.role, routeAccess.manager)) {
    return NextResponse.redirect(new URL("/main", request.nextUrl));
  }

  if (pathname.includes("housekeeping") && !hasAccess(payload.role, routeAccess.housekeeping)) {
    return NextResponse.redirect(new URL("/main", request.nextUrl));
  }

  if (pathname.includes("restauration") && !hasAccess(payload.role, routeAccess.restauration)) {
    return NextResponse.redirect(new URL("/main", request.nextUrl));
  }

  if (pathname.includes("stock") && !hasAccess(payload.role, routeAccess.stock)) {
    return NextResponse.redirect(new URL("/main", request.nextUrl));
  }

  if (pathname.includes("reception")) {
    const requiredRoles = pathname.includes("gyms") ? routeAccess.gyms : routeAccess.reception;
    if (!hasAccess(payload.role, requiredRoles)) {
      return NextResponse.redirect(new URL("/main", request.nextUrl));
    }
  }

  return null;
};

async function verifyToken(token: string): Promise<DecodedToken> {
  const secret = new TextEncoder().encode(process.env.JWT_HOTEL_SECRET);
  const { payload } = await jwtVerify(token, secret) as JWTVerifyResult & {
    payload: DecodedToken;
  };

  if (Date.now() >= payload.exp * 1000) {
    throw new UnauthorizedError("Token has expired");
  }

  const subscriptionEndDate = new Date(payload.endDate);
  if (subscriptionEndDate < new Date()) {
    throw new SubscriptionError("Subscription has ended");
  }

  return payload;
};



export async function middleware(request: NextRequest) {
 
  const pathname = request.nextUrl.pathname;

  if (pathname.startsWith("/main")) {
    const token = cookies().get("hotelToken")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/main", request.nextUrl));
    };

    const payload = await verifyToken(token);

    const redirectResponse = checkRouteAccess(pathname, payload, request);
    if (redirectResponse) return redirectResponse;

  };

  const token = request.cookies.get("hotelToken")?.value;

  if (!token) {
    return handleError(new AuthenticationError("Authentication required"));
  }

  try {
    const payload = await verifyToken(token);

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