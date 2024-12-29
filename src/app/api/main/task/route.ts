import { NextRequest, NextResponse } from "next/server";
import {
  addTask,
  getAllTasks,
  checkRestaurantManagerReceptionManagerAdminRole,
} from "@/app/api/main/task/controller";
import { AddTaskData, requiredTaskFields } from "@/app/api/main/task/types";
import { handleError } from "@/lib/error_handler/handleError";
import { getUser } from "@/lib/token/getUserFromToken";
import { TranslateObjKeysFromEngToFr } from "@/app/utils/translation";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const user = getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non Authorisé" }, { status: 401 });
    }
    
    checkRestaurantManagerReceptionManagerAdminRole(user.role);
    const data: AddTaskData = await request.json();
    const missingFields = requiredTaskFields.filter(
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

    const newTask = await addTask(data, user.hotelId, user.id, user.role);

    return NextResponse.json(
      {
        message: "Tache créer avec succès",
      },
      { status: 201 }
    );
  } catch (error) {
    return handleError(error);
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non Authorisé" }, { status: 401 });
    }
    await checkRestaurantManagerReceptionManagerAdminRole(user.role);

    const tasks = await getAllTasks(user.id,user.role,user.hotelId);
    return NextResponse.json(tasks, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}
