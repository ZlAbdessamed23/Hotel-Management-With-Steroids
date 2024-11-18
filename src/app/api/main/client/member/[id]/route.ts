import { NextRequest, NextResponse } from "next/server";
import {
  checkReceptionistAdminRole,
  checkReceptionistRole,
  deleteMemberById,
  getMemberById,
  updateMember,
} from "./controller";
import { handleError } from "@/lib/error_handler/handleError";
import { UpdateMemberData } from "./types";
import { getUser } from "@/lib/token/getUserFromToken";

/////////////////////// get member with id //////////////////////////////////
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const user = getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non Authorisé" }, { status: 401 });
    }
    console.log(user);
    checkReceptionistAdminRole(user.role);

    const memberId = params.id;
    const member = await getMemberById(memberId, user.hotelId);

    return NextResponse.json(member, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}

/////////////////////////////// delete Member //////////////////////////////////////////////
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const user = getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non Authorisé" }, { status: 401 });
    }
    console.log(user);
    checkReceptionistRole(user.role);

    const memberId = params.id;
    const deletedMember = await deleteMemberById(memberId, user.hotelId);

    return NextResponse.json(
      { message: "Membre mis à jour avec succès" },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error);
  }
}

//////////////////////// Update member ////////////////////////////
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const user = getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non Authorisé" }, { status: 401 });
    }
    console.log(user);
    checkReceptionistRole(user.role);

    const memberId = params.id;
    const updateData: UpdateMemberData = await request.json();

    const updatedMember = await updateMember(
      memberId,
      user.hotelId,
      updateData
    );

    return NextResponse.json(
      { message: "Membre mis à jour avec succès" },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error);
  }
}
