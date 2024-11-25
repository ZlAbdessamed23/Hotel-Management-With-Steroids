import { handleError } from "@/lib/error_handler/handleError";
import { getUser } from "@/lib/token/getUserFromToken";
import { NextRequest, NextResponse } from "next/server";
import { checkReceptionManagerCoachAdminRole, getSportFacilityCoach } from "@/app/api/main/sports_facility/coach/[sportsFacilityId]/[id]/controller";

export async function GET(
  request: NextRequest,
  { params }: { params: { sportsFacilityId: string; id: string } }
) {
  try {
    const user = getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non Authorisé" }, { status: 401 });
    }

    console.log(user);
    checkReceptionManagerCoachAdminRole(user.role);
    const { sportsFacilityId, id } = params;
    const sportsFacilityCoaches = await getSportFacilityCoach(
      id,
      sportsFacilityId,
      user.hotelId
    );
    return NextResponse.json(sportsFacilityCoaches, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}
