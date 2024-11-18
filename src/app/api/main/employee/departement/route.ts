import { getUser } from "@/lib/token/getUserFromToken";
import { NextRequest, NextResponse } from "next/server";
import { getDepartmentEmployees } from "@/app/api/main/employee/departement/controller";
import { handleError } from "@/lib/error_handler/handleError";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const user = getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.log(user);

    const employees = await getDepartmentEmployees(user.hotelId, user.role);
    return NextResponse.json(employees, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}
