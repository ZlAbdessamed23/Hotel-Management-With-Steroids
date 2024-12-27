import { NextRequest, NextResponse } from "next/server";
import {
  addSportsFacilityMember,
  checkReceptionistManagerCoachRole,
} from "@/app/api/main/sports_facility/member/controller";

import { handleError } from "@/lib/error_handler/handleError";
import { getUser } from "@/lib/token/getUserFromToken";
import {
  AddSportsFacilityMemberData,
  requiredSportsFacilityFields,
} from "@/app/api/main/sports_facility/member/types";

export async function POST(request: NextRequest) {
  try {
    const user = getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non Authorisé" }, { status: 401 });
    }


    checkReceptionistManagerCoachRole(user.role);
    const data: AddSportsFacilityMemberData = await request.json();
    const missingFields = requiredSportsFacilityFields.filter(
      (field) => !data[field]
    );
    if (missingFields.length > 0) {
      return NextResponse.json(
        { message: `${missingFields.join(", ")}:sont requis ` },
        { status: 400 }
      );
    }

    const sportsFacilityMembers = await addSportsFacilityMember(data);
    return NextResponse.json(
      {
        message: `le membre ${sportsFacilityMembers.sportsFacilityMember.clientName} a été ajouté avec succès`,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error);
  }
}
