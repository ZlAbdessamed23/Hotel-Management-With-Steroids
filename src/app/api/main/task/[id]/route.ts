import { getUser } from "@/lib/token/getUserFromToken";
import { NextRequest, NextResponse } from "next/server";
import { updateTask, getTaskById, deleteTask } from "./controller";
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

    const taskId = params.id;
    const task = await getTaskById(taskId, user.id, user.role);

    return NextResponse.json(task, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const user = getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non Authorisé" }, { status: 401 });
    }
    console.log(user);

    const taskId = params.id;
    const deletedTask = await deleteTask(
      taskId,
      user.id,
      user.hotelId,
      user.role
    );

    return NextResponse.json(
      {
        message: "Tache supprimée avec succès",
      },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const user = getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non Authorisé" }, { status: 401 });
    }
    const taskId = params.id;
    const updateData = await request.json();

    const updatedTask = await updateTask(
      taskId,
      user.hotelId,
      user.id,
      user.role,
      updateData
    );

    return NextResponse.json(
      {
        message: "Tache mise à jour avec succès",
      },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error);
  }
}
