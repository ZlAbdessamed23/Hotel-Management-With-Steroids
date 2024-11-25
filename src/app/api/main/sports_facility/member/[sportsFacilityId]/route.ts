import { NextRequest, NextResponse } from "next/server";
import {
  getAllSportsFacilityMembers,
  checkReceptionManagerCoachAdminRole,
} from "@/app/api/main/sports_facility/member/[sportsFacilityId]/controller";

import { handleError } from "@/lib/error_handler/handleError";
import { getUser } from "@/lib/token/getUserFromToken";

export async function GET(
  request: NextRequest,
  { params }: { params: { sportsFacilityId: string } }
) {
  try {
    const user = getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non Authorisé" }, { status: 401 });
    }

    console.log(user);
    checkReceptionManagerCoachAdminRole(user.role);
    const { sportsFacilityId } = params;
    const sportsFacilityMembers = await getAllSportsFacilityMembers(
      user.hotelId,
      sportsFacilityId
    );
    return NextResponse.json(sportsFacilityMembers, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}
