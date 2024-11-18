import { NextRequest, NextResponse } from "next/server";
import {
  getAllSportsFacilityCoaches,
  checkReceptionManagerCoachAdminRole,
  checkReceptionManagerCoachRole,
  updateSportsFacilityCoaches,
} from "@/app/api/main/sports_facility/coach/[sportsFacilityId]/controller";

import { handleError } from "@/lib/error_handler/handleError";
import { getUser } from "@/lib/token/getUserFromToken";
/////////////////////GET ///////////////////////////////

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
    const sportsFacilityCoaches = await getAllSportsFacilityCoaches(
      sportsFacilityId,
      user.hotelId
    );
    return NextResponse.json(sportsFacilityCoaches, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}
/////////////////////////// PATCH///////////////////////
export async function PATCH(
  request: NextRequest,
  { params }: { params: { sportsFacilityId: string } }
) {
  try {
    const user = getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non Authorisé" }, { status: 401 });
    }

    console.log(user);
    checkReceptionManagerCoachRole(user.role);
    const { sportsFacilityId } = params;
    const updateData = await request.json();
    const sportsFacilityCoaches = await updateSportsFacilityCoaches(
      sportsFacilityId,
      user.hotelId,

      updateData
    );
    return NextResponse.json({
      message : `la liste des entraineurs a été mise à jour avec succès`
    }, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}
