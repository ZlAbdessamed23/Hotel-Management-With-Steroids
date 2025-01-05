// app/api/main/LostObject/route.ts
import { NextRequest, NextResponse } from "next/server";
import { addLostObject, checkAdminReceptionManagerReceptionistGvernementRole,checkReceptionManagerReceptionistGvernementRole, getAllLostObjects } from "./controller";
import { handleError } from "@/lib/error_handler/handleError";
import { getUser } from "@/lib/token/getUserFromToken";
import { AddLostObjectData, requiredLostObjectFields } from "@/app/api/main/housekeeping/lostObject/types";
import { TranslateObjKeysFromEngToFr } from "@/app/utils/translation";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const user = getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non Authorisé" }, { status: 401 });
    }
    
    checkReceptionManagerReceptionistGvernementRole(user.role);

    const data: AddLostObjectData = await request.json();
    console.log(data);
    const missingFields = requiredLostObjectFields.filter(
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

    const LostObject = await addLostObject(data, user.hotelId);

    return NextResponse.json(
      {
        message: "objet perdu crée avec succès",
      },
      { status: 201 }
    );
  } catch (error) {
    return handleError(error);
  }
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const user = getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non Authorisé" }, { status: 401 });
    }

    checkAdminReceptionManagerReceptionistGvernementRole(user.role);
    const LostObjects = await getAllLostObjects(user.hotelId);
    return NextResponse.json(LostObjects, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}
