import { NextRequest, NextResponse } from "next/server";
import {
  addSportsFacilityMember,
  checkReceptionistManagerCoachRole,
} from "@/app/api/main/sports_facility/member/controller";

import { handleError } from "@/lib/error_handler/handleError";
import { getUser } from "@/lib/token/getUserFromToken";
import {
  AddSportsFacilityMemberData,
  requiredSportsFacilityMemberFields,
} from "@/app/api/main/sports_facility/member/types";
import { TranslateObjKeysFromEngToFr } from "@/app/utils/translation";

export async function POST(request: NextRequest) {
  try {
    const user = getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non Authorisé" }, { status: 401 });
    }


    checkReceptionistManagerCoachRole(user.role);
    const data: AddSportsFacilityMemberData = await request.json();
    const missingFields = requiredSportsFacilityMemberFields.filter(
          (field) => !data[field]
        );
    
        if (missingFields.length > 0) {
          const translatedFields = missingFields.map(field => 
            TranslateObjKeysFromEngToFr(field)
          );
    
          return NextResponse.json(
            { message: `${translatedFields.join(", ")}: sont requis` },
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
