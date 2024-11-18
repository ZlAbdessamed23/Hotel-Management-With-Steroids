import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/token/getUserFromToken";
import { deleteNote, getNoteById, updateNote } from "./controller";
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

    const noteId = params.id;

    const note = await getNoteById(noteId, user.id, user.role, user.hotelId);

    return NextResponse.json(note, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}

//////////////////////////////// Delete ////////////////////////////
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const user = getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non Authorisé" }, { status: 401 });
    }

    const noteId = params.id;

    const result = await deleteNote(noteId, user.id, user.role, user.hotelId);

    return NextResponse.json({
      message : "Note supprimée avec succès"
    }, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}

////////////////////////// Patch //////////////////////////////////
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const user = getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non Authorisé" }, { status: 401 });
    }

    const noteId = params.id;
    const updateData = await request.json();

    const updatedNote = await updateNote(
      noteId,
      user.id,
      user.role,
      user.hotelId,
      updateData
    );

    return NextResponse.json({
      message : "Note mise à jour avec succès"
    }, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}
