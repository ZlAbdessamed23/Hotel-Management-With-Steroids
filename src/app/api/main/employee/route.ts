// app/api/main/employee/route.ts
import { NextRequest, NextResponse } from "next/server";
import { addEmployee, checkAdminRole, getAllEmployees } from "@/app/api/main/employee/controller";
import { handleError } from "@/lib/error_handler/handleError";
import { AddEmployeeData, requiredFields } from "@/app/api/main/employee/types";

import { getUser } from "@/lib/token/getUserFromToken";
import { TranslateObjKeysFromEngToFr } from "@/app/utils/translation";


export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const user = getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non Authorisé" }, { status: 401 });
    }
    
    checkAdminRole(user.role);

    const data: AddEmployeeData = await request.json();
    
    const missingFields = requiredFields.filter(
      (field) => !data[field]
    );

    if (missingFields.length > 0) {
      const translatedFields = missingFields.map(field => 
        TranslateObjKeysFromEngToFr(field)
      );

      return NextResponse.json(
        { message: `${translatedFields.join(", ")}: sont requis` },
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
