import { NextRequest, NextResponse } from "next/server";
import { addNote, getAllNotes } from "./controller";
import { AddNoteData, requiredNoteFields } from "./types";
import { handleError } from "@/lib/error_handler/handleError";
import { getUser } from "@/lib/token/getUserFromToken";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const user = getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non Authorisé" }, { status: 401 });
    }

    const data: AddNoteData = await request.json();
    const missingFields = requiredNoteFields.filter((field) => !data[field]);
    if (missingFields.length > 0) {
      return NextResponse.json(
        { message: `${missingFields.join(", ")}: sont requis ` },
        { status: 400 }
      );
    }

    const newNote = await addNote(data, user.hotelId, user.id, user.role);

    return NextResponse.json({
      message : "Note crée avec succès"
    }, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}
////////////////////////// get ////////////////////////////////
export async function GET(request: NextRequest) {
  try {
    const user = getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non Authorisé" }, { status: 401 });
    }

    const { hotelId, id: userId, role: userRole } = user;

    const notesResult = await getAllNotes(hotelId, userId, userRole);

    return NextResponse.json(notesResult, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}