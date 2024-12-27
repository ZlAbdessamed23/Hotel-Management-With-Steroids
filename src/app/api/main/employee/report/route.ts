import { getUser } from "@/lib/token/getUserFromToken";
import { NextRequest, NextResponse } from "next/server";
import { getEmployeesForReport } from "@/app/api/main/employee/report/controller";
import { handleError } from "@/lib/error_handler/handleError";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const user = getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non Authorisé" }, { status: 401 });
    }
    

    const employees = await getEmployeesForReport(user.hotelId);
    return NextResponse.json(employees, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}
