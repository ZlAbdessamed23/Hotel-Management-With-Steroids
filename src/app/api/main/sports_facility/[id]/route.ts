import { getUser } from "@/lib/token/getUserFromToken";
import { NextRequest, NextResponse } from "next/server";
import {
  
  checkReceptionManagerCoachAdminRole,
  deleteSportsFacility,
  getSportsFacilityById,
  updateSportsFacility,
} from "@/app/api/main/sports_facility/[id]/controller";
import { handleError } from "@/lib/error_handler/handleError";
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const user = getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non Authorisé" }, { status: 401 });
    }
    
    checkReceptionManagerCoachAdminRole(user.role);

    const roomId = params.id;
    const room = await getSportsFacilityById(roomId, user.hotelId);

    return NextResponse.json(room, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}
/////////////////////////////// delete Room //////////////////////////////////////////////
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const user = getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non Authorisé" }, { status: 401 });
    }
    
    checkReceptionManagerCoachAdminRole(user.role);

    const employeeId = params.id;
    const deletedEmployee = await deleteSportsFacility(
      employeeId,
      user.hotelId
    );

    return NextResponse.json(
      {
        message: `Salle de sport supprimé avec succès`,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error);
  }
}
//////////////////////////update ////////////////////////
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const user = getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non Authorisé" }, { status: 401 });
    }
    checkReceptionManagerCoachAdminRole(user.role);
    const sportsFacilityId = params.id;
    const updateData = await request.json();

    const updatedSportFacility = await updateSportsFacility(
      sportsFacilityId,

      user.hotelId,
      updateData
    );

    return NextResponse.json(
      {
        message: `Salle de sport mise à jour avec succès`,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error);
  }
}
