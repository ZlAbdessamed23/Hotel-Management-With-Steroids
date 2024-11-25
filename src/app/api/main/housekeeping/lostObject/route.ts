// app/api/main/LostObject/route.ts
import { NextRequest, NextResponse } from "next/server";
import { addLostObject, checkAdminReceptionGvernementRole, getAllLostObjects } from "./controller";
import { handleError } from "@/lib/error_handler/handleError";
import { getUser } from "@/lib/token/getUserFromToken";
import { AddLostObjectData, requiredLostObjectFields } from "./types";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const user = getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non Authorisé" }, { status: 401 });
    }
    console.log(user);
    checkAdminReceptionGvernementRole(user.role);

    const data: AddLostObjectData = await request.json();
    console.log(data);
    const missingField = requiredLostObjectFields.find((field) => !data[field]);
    if (missingField) {
      return NextResponse.json(
        { message: `${missingField} est requis` },
        { status: 400 }
      );
    }

    const LostObject = await addLostObject(data, user.hotelId);

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

    checkAdminReceptionGvernementRole(user.role);
    const LostObjects = await getAllLostObjects(user.hotelId);
    return NextResponse.json(LostObjects, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}
