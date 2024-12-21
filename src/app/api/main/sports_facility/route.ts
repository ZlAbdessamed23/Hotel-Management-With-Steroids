import { NextRequest, NextResponse } from "next/server";
// Adjust the import path as needed
import {
  addSportsFacility,
  getAllSportsFacility,
  checkReceptionManagerCoachAdminRole,
  
} from "@/app/api/main/sports_facility/controller";
import {
  AddSportsFacilityData,
  requiredSportsFacilityFields,
} from "@/app/api/main/sports_facility/types";

import { handleError } from "@/lib/error_handler/handleError";
import { getUser } from "@/lib/token/getUserFromToken";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const user = getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non Authorisé" }, { status: 401 });
    }
    
    checkReceptionManagerCoachAdminRole(user.role);

    const data: AddSportsFacilityData = await request.json();
    const missingFields = requiredSportsFacilityFields.filter(
      (field) => !data[field]
    );
    if (missingFields.length > 0) {
      return NextResponse.json(
        { message: `${missingFields.join(", ")}: sont requis` },
        { status: 400 }
      );
    }

    const newSportsFacility = await addSportsFacility(data, user.hotelId);

    return NextResponse.json(
      {
        message: `Salle de sport crée avec succès`,
      },
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
    

    // Check if the user is either an admin or a receptionist
    checkReceptionManagerCoachAdminRole(user.role);

    const sportsFacility = await getAllSportsFacility(user.id,user.role,user.hotelId);
    return NextResponse.json(sportsFacility, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}
