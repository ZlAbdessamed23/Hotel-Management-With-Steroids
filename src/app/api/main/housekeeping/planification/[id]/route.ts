import { NextRequest, NextResponse } from "next/server";
import {
  checkReceptionManagerReceptionistGouvernementAdminRole,
  checkReceptionManagerReceptionistGouvernementRole,
  deleteHouseKeepingPlanification,
  getHouseKeepingPlanificationById,
  updateHouseKeepingPlanification,
} from "@/app/api/main/housekeeping/planification/[id]/controller";
import { handleError } from "@/lib/error_handler/handleError";
import { UpdateHouseKeepingPlanificationData } from "@/app/api/main/housekeeping/planification/[id]/types";
import { getUser } from "@/lib/token/getUserFromToken";

/////////////////////// Get Cafeteria Menu Item //////////////////////////////////////
export async function GET(
  request: NextRequest,
  { params }: { params: {  id: string } }
): Promise<NextResponse> {
  try {
    const user = getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non Authorisé" }, { status: 401 });
    }
    
    checkReceptionManagerReceptionistGouvernementAdminRole(user.role);

    const {  id } = params;
    const HouseKeepingPlanification = await getHouseKeepingPlanificationById(
      
      id,
      user.hotelId
    );

    return NextResponse.json(HouseKeepingPlanification, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}

/////////////////////////////// Delete Cafeteria Menu Item //////////////////////////////////////////////
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const user = getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non Authorisé" }, { status: 401 });
    }
    
    checkReceptionManagerReceptionistGouvernementRole(user.role);

    const { id } = params;
    const HouseKeepingPlanification = await deleteHouseKeepingPlanification(
      
      id,
      user.hotelId
    );

    return NextResponse.json(
      {
        message: `la plan ${HouseKeepingPlanification.HouseKeepingPlanification.title} a été supprimé avec succès`,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error);
  }
}

//////////////////////// Update Cafeteria Menu Item ////////////////////////////
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const user = getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non Authorisé" }, { status: 401 });
    }
    
    checkReceptionManagerReceptionistGouvernementRole(user.role);

    const { id } = params;
    const updateData: UpdateHouseKeepingPlanificationData = await request.json();

    const seance = await updateHouseKeepingPlanification(
      
      id,
      user.hotelId,
      updateData
    );

    return NextResponse.json(
      { message: "Seance mis à jour avec succès" },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error);
  }
}
