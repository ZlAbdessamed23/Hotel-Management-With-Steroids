import { NextRequest } from "next/server";
import { DecodedToken } from "./decodedToken";

export function getUser(request: NextRequest): DecodedToken | null {
  const userDataStr = request.headers.get("x-user-data");
  if (!userDataStr) return null;
  try {
    return JSON.parse(userDataStr) as DecodedToken;
  } catch {
    return null;
  }
}
