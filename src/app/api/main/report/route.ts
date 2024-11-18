import { NextRequest, NextResponse } from "next/server";
import { addDocument, getAllDocuments } from "./controller";
import { AddDocumentData, requiredDocumentFields } from "./types";
import { handleError } from "@/lib/error_handler/handleError";
import { getUser } from "@/lib/token/getUserFromToken";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const user = getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non Authorisé" }, { status: 401 });
    }
    console.log(user);

    const data: AddDocumentData = await request.json();
    const missingFields = requiredDocumentFields.filter(
      (field) => !data[field]
    );
    if (missingFields.length > 0) {
      return NextResponse.json(
        { message: `${missingFields.join(", ")}: sont requis ` },
        { status: 400 }
      );
    }

    const newDocument = await addDocument(
      data,
      user.hotelId,
      user.id,
      user.role
    );

    return NextResponse.json(
      { message: "Rapport crée avec succès" },
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

    const documents = await getAllDocuments(user.hotelId);
    return NextResponse.json(documents, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}
