import { NextRequest, NextResponse } from "next/server";
import {
  addTask,
  getAllTasks,
  checkRestaurantManagerReceptionManagerAdminRole,
} from "./controller";
import { AddTaskData, requiredTaskFields } from "./types";
import { handleError } from "@/lib/error_handler/handleError";
import { getUser } from "@/lib/token/getUserFromToken";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const user = getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non Authorisé" }, { status: 401 });
    }
    console.log(user);
    checkRestaurantManagerReceptionManagerAdminRole(user.role);
    const data: AddTaskData = await request.json();
    const missingFields = requiredTaskFields.filter((field) => !data[field]);
    if (missingFields.length > 0) {
      return NextResponse.json(
        { message: `${missingFields.join(", ")}: sont requis ` },
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
    console.log(user);

    const tasks = await getAllTasks(user.hotelId);
    return NextResponse.json(tasks, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}
