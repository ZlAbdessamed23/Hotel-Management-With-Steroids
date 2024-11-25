// app/api/main/employee/route.ts
import { NextRequest, NextResponse } from "next/server";
import { addEmployee, checkAdminRole, getAllEmployees } from "./controller";
import { handleError } from "@/lib/error_handler/handleError";
import { AddEmployeeData, requiredFields } from "@/app/api/main/employee/types";

import { getUser } from "@/lib/token/getUserFromToken";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const user = getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non Authorisé" }, { status: 401 });
    }
    console.log(user);
    checkAdminRole(user.role);

    const data: AddEmployeeData = await request.json();
    console.log(data);
    const missingField = requiredFields.find((field) => !data[field]);
    if (missingField) {
      return NextResponse.json(
        { message: `${missingField} est requis` },
        { status: 400 }
      );
    }

    const employee = await addEmployee(data, user.hotelId);

    return NextResponse.json(
      {
        message: "employée crée avec succès",
      },
      { status: 201 }
    );
  } catch (error) {
    return handleError(error);
  }
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const user = getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non Authorisé" }, { status: 401 });
    }

    checkAdminRole(user.role);
    const employees = await getAllEmployees(user.hotelId);
    return NextResponse.json(employees, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}
