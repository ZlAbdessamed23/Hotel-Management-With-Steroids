
import { handleError } from "@/lib/error_handler/handleError";
import { getUser } from "@/lib/token/getUserFromToken";
import { NextRequest, NextResponse } from "next/server";
import { checkReceptionistAdminRole, deletePendingReservation, updateClientAndReservation } from "./controller";

export async function DELETE(
    request: NextRequest,
    { params }: { params: { clientId: string,reservationId:string } }
  ): Promise<NextResponse> {
    try {
      const user = getUser(request);
      if (!user) {
        return NextResponse.json({ error: "Non Authorisé" }, { status: 401 });
      }
      console.log(user);
      checkReceptionistAdminRole(user.role);
  
      const {clientId,reservationId} = params;
      const deletedEmployee = await deletePendingReservation(reservationId);
  
      return NextResponse.json(
        { message: "En attent Reservation supprimé avec succès" },
        { status: 200 }
      );
    } catch (error) {
      return handleError(error);
    }
  }
  ////////////////////// update ///////////////////////
  export async function PATCH(
    request: NextRequest,
    { params }: { params: { clientId: string,reservationId : string } }
  ): Promise<NextResponse> {
    try {
      const user = getUser(request);
      if (!user) {
        return NextResponse.json({ error: "Non Authorisé" }, { status: 401 });
      }
      console.log(user);
      checkReceptionistAdminRole(user.role);
  
      const {clientId,reservationId} = params;
      
  
      const updatedEmployee = await updateClientAndReservation(
       clientId,reservationId ,user.hotelId
      );
  
      return NextResponse.json(
        { message: "Employee mis à jour avec succès" },
        { status: 200 }
      );
    } catch (error) {
      return handleError(error);
    }
  }