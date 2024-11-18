import { NextRequest, NextResponse } from "next/server";
import {
  addMember,
  checkReceptionistAdminRole,
  checkReceptionistRole,
  getAllMembers,
} from "./controller";
import { AddMemberData, requiredMemberFields } from "./types";
import { handleError } from "@/lib/error_handler/handleError";
import { getUser } from "@/lib/token/getUserFromToken";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const user = getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non Authorisé" }, { status: 401 });
    }
    console.log(user);
    checkReceptionistRole(user.role);

    const data: AddMemberData = await request.json();
    const missingField = requiredMemberFields.find((field) => !data[field]);
    if (missingField) {
      return NextResponse.json(
        { message: `${missingField} est requis` },
        { status: 400 }
      );
    }

    const newMember = await addMember(data, user.hotelId, user.id);

    return NextResponse.json(
      { message: "Membre crée avec succès" },
      { status: 201 }
    );
  } catch (error) {
    return handleError(error);
  }
}

///////////////////////////// Get ////////////////////////////////////
export async function GET(request: NextRequest) {
  try {
    const user = getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non Authorisé" }, { status: 401 });
    }
    console.log(user);

    // Check if the user is either an admin or a receptionist
    checkReceptionistAdminRole(user.role);

    const members = await getAllMembers(user.hotelId);
    return NextResponse.json(members, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}
