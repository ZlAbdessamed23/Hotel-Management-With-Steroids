import { getUser } from "@/lib/token/getUserFromToken";
import { NextRequest, NextResponse } from "next/server";
import { updateDocument, getDocumentById, deleteDocument } from "@/app/api/main/report/[id]/controller";
import { handleError } from "@/lib/error_handler/handleError";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const user = getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    

    const documentId = params.id;
    const document = await getDocumentById(
      documentId,
      user.hotelId,
      user.id,
      user.role
    );

    return NextResponse.json(document, { status: 200 });
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
    

    const documentId = params.id;
    const deletedDocument = await deleteDocument(
      documentId,
      user.hotelId,
      user.id,
      user.role
    );

    return NextResponse.json(
      { message: "Rapport supprimé avec succès" },
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const documentId = params.id;
    const updateData = await request.json();

    const updatedDocument = await updateDocument(
      documentId,
      
      updateData
    );

    return NextResponse.json(
      { message: "Rapport mis à jour avec succès" },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error);
  }
}
