import { NextRequest, NextResponse } from "next/server";
// Adjust the import path as needed
import {
  AddHouseKeepingPlanificationData,
  requiredHouseKeepingPlanificationFields,
} from "@/app/api/main/housekeeping/planification/types";
import {
  addHouseKeepingPlanification,
  getAllHouseKeepingPlanifications,
  checkReceptionManagerReceptionistGouvernementRole,
  checkReceptionManagerReceptionistGouvernementAdminRole
} from "@/app/api/main/housekeeping/planification/controller";

import { handleError } from "@/lib/error_handler/handleError";
import { getUser } from "@/lib/token/getUserFromToken";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const user = getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non Authorisé" }, { status: 401 });
    }
    console.log(user);
    checkReceptionManagerReceptionistGouvernementRole(user.role);

    const data: AddHouseKeepingPlanificationData = await request.json();
    const missingFields = requiredHouseKeepingPlanificationFields.filter(
      (field) => !data[field]
    );
    if (missingFields.length > 0) {
      return NextResponse.json(
        { message: `${missingFields.join(", ")} sont requis` },
        { status: 400 }
      );
    }

    const newHouseKeepingPlanification = await addHouseKeepingPlanification(data, user.hotelId);

    return NextResponse.json(
      {
        message: `la plan ${newHouseKeepingPlanification.HouseKeepingPlanification.title} a été crée avec succès`,
      },
      { status: 201 }
    );
  } catch (error) {
    return handleError(error);
  };
};


export async function GET(
  request: NextRequest,
): Promise<NextResponse> {
  try {
    const user = getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non Authorisé" }, { status: 401 });
    }
    checkReceptionManagerReceptionistGouvernementAdminRole(user.role);

    const HouseKeepingPlanifications = await getAllHouseKeepingPlanifications(user.hotelId);

    return NextResponse.json(HouseKeepingPlanifications, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}