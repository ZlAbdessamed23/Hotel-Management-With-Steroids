import { NextRequest, NextResponse } from "next/server";
import {
  getSportsFacilityMemberById,
  deleteSportsFacilityMemberById,
  updateSportsFacilityMember,
  checkReceptionManagerCoachAdminRole,
  checkReceptionManagerCoachRole,
} from "@/app/api/main/sports_facility/member/[sportsFacilityId]/[memberId]/controller";
import { handleError } from "@/lib/error_handler/handleError";
import { UpdateSportsFacilityMemberData } from "@/app/api/main/sports_facility/member/[sportsFacilityId]/[memberId]/types";
import { getUser } from "@/lib/token/getUserFromToken";

/////////////////////// get sports facility member with id //////////////////////////////////
export async function GET(
  request: NextRequest,
  { params }: { params: { sportsFacilityId: string; memberId: string } }
): Promise<NextResponse> {
  try {
    const user = getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    checkReceptionManagerCoachAdminRole(user.role);

    const { sportsFacilityId, memberId } = params;
    const member = await getSportsFacilityMemberById(
      sportsFacilityId,
      memberId,
      user.hotelId
    );

    return NextResponse.json(member, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}

/////////////////////////////// delete sports facility member //////////////////////////////////////////////
export async function DELETE(
  request: NextRequest,
  { params }: { params: { sportsFacilityId: string; memberId: string } }
): Promise<NextResponse> {
  try {
    const user = getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    checkReceptionManagerCoachRole(user.role);

    const { sportsFacilityId, memberId } = params;
    const deletedMember = await deleteSportsFacilityMemberById(
      sportsFacilityId,
      memberId,
      user.hotelId
    );

    return NextResponse.json(
      {
        message: `le membre ${deletedMember.sportsFacilityMember.clientName} a été supprimé avec succès`,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error);
  }
}

//////////////////////// Update sports facility member ////////////////////////////
export async function PATCH(
  request: NextRequest,
  { params }: { params: { sportsFacilityId: string; memberId: string } }
): Promise<NextResponse> {
  try {
    const user = getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non Authorisé" }, { status: 401 });
    }
    
    checkReceptionManagerCoachRole(user.role);

    const { sportsFacilityId, memberId } = params;
    const updateData: UpdateSportsFacilityMemberData = await request.json();

    const updatedMember = await updateSportsFacilityMember(
      sportsFacilityId,
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
