// app/api/main/employee/route.ts
import { NextRequest, NextResponse } from "next/server";
import {
  checkAdminRole,
  getEmployeeById,
  deleteEmployeeById,
  updateEmployee,
} from "@/app/api/main/employee/[id]/controller";
import { handleError } from "@/lib/error_handler/handleError";
import { UpdateEmployeeData } from "@/app/api/main/employee/[id]/types";

import { getUser } from "@/lib/token/getUserFromToken";

// ... keep your existing POST and GET routes ...

// New route to get an employee by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const user = getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non Authorisé" }, { status: 401 });
    }
    
    checkAdminRole(user.role);

    const employeeId = params.id;
    const employee = await getEmployeeById(employeeId, user.hotelId);

    return NextResponse.json(employee, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}

// New route to delete an employee by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const user = getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non Authorisé" }, { status: 401 });
    }
    
    checkAdminRole(user.role);

    const employeeId = params.id;
    const deletedEmployee = await deleteEmployeeById(employeeId, user.hotelId);

    return NextResponse.json(
      { message: "Employee supprimé avec succès" },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error);
  }
}
////////////////////// update ///////////////////////
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const user = getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non Authorisé" }, { status: 401 });
    }
    
    checkAdminRole(user.role);

    const employeeId = params.id;
    const updateData: UpdateEmployeeData = await request.json();

    const updatedEmployee = await updateEmployee(
      employeeId,
      user.hotelId,
      updateData
    );

    return NextResponse.json(
      { message: "Employee mis à jour avec succès" },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error);
  }
}
