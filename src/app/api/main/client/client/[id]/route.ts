import { NextRequest, NextResponse } from "next/server";
import {
  checkReceptionistAdminRole,
  checkReceptionistRole,
  deleteClientById,
  getClientById,
  updateClient,
} from "./controller";
import { handleError } from "@/lib/error_handler/handleError";
import { UpdateClientData } from "./types";
import { getUser } from "@/lib/token/getUserFromToken";

/////////////////////// get client with id //////////////////////////////////
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const user = getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non Authorisé" }, { status: 401 });
    }
    console.log(user);
    checkReceptionistAdminRole(user.role);

    const clientId = params.id;
    const client = await getClientById(clientId, user.hotelId);

    return NextResponse.json(client, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}

/////////////////////////////// delete Client //////////////////////////////////////////////
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
    checkReceptionistRole(user.role);

    const clientId = params.id;
    const deletedClient = await deleteClientById(clientId, user.hotelId);

    return NextResponse.json(
      { message: "Client supprimé avec succès" },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error);
  }
}

//////////////////////// Update client ////////////////////////////
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const user = getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non Authorisé" }, { status: 401 });
    }
    console.log(user);
    checkReceptionistRole(user.role);

    const clientId = params.id;
    const updateData: UpdateClientData = await request.json();

    const updatedClient = await updateClient(
      clientId,
      user.hotelId,
      updateData
    );

    return NextResponse.json(
      { message: "Client mis à jour avec succès" },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error);
  }
}
