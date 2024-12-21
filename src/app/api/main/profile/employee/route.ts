import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/token/getUserFromToken"; // Adjust the import path as needed
import {
  getEmployeeWithTasks,
  updateProfile,
} from "@/app/api/main/profile/employee/controller";
import { handleError } from "@/lib/error_handler/handleError";
import { UpdateEmployeeData } from "@/app/api/main/profile/employee/types";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const user = getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non Authorisé" }, { status: 401 });
    }
   

    const employeeWithTasks = await getEmployeeWithTasks(user.id);
    return NextResponse.json(employeeWithTasks, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}
export async function PATCH(request: NextRequest): Promise<NextResponse> {
  try {
    const user = getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non Authorisé" }, { status: 401 });
    }
 

    const updateData: UpdateEmployeeData = await request.json();

    await updateProfile(user.id, user.hotelId, updateData);

    return NextResponse.json(
      { message: "Profile mis à jour avec succès" },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error);
  }
}
