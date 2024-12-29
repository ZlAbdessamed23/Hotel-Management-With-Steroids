import { NextRequest, NextResponse } from "next/server";
import {
  addClient,
  checkReceptionistReceptionManagerAdminRole,
  checkReceptionistReceptionManagerRole,
  getAllClients,
} from "@/app/api/main/client/client/controller";
import { AddClientData, requiredClientFields } from "@/app/api/main/client/client/types";
import { handleError } from "@/lib/error_handler/handleError";
import { getUser } from "@/lib/token/getUserFromToken";
import { TranslateObjKeysFromEngToFr } from "@/app/utils/translation";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const user = getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non Authorisé" }, { status: 401 });
    }
    
    checkReceptionistReceptionManagerRole(user.role);

    const data: AddClientData = await request.json();
    const missingFields = requiredClientFields.filter(
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

    const newClient = await addClient(data, user.hotelId, user.id);

    return NextResponse.json(
      { message: "Client crée avec succès" },
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
    

    // Check if the user is either an admin or a receptionistReceptionManager
    checkReceptionistReceptionManagerAdminRole(user.role);

    const clients = await getAllClients(user.hotelId);
    return NextResponse.json(clients, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}
