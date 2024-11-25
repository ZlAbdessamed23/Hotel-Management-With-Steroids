import { getUser } from "@/lib/token/getUserFromToken";
import { NextRequest, NextResponse } from "next/server";
import {
  checkAdminRole,
  getDashboardData,
} from "@/app/api/main/dashboard/controller";
import { handleError } from "@/lib/error_handler/handleError";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const user = getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non Authorisé" }, { status: 401 });
    }
    console.log(user);
    checkAdminRole(user.role);
    const DashboardData = await getDashboardData(
      user.hotelId,
      user.id,
      new Date(user.endDate)
    );
    return NextResponse.json(DashboardData, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}
