import { getUser } from "@/lib/token/getUserFromToken";
import { NextRequest, NextResponse } from "next/server";
import { updateCafeteria, getCafeteriaById, deleteCafeteria, checkAdminReceptionManagerRestaurantManagerRole } from "@/app/api/main/food/cafeteria/cafeteria/[id]/controller";
import { UpdateCafeteriaData } from "@/app/api/main/food/cafeteria/cafeteria/[id]/types";
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
    
    checkAdminReceptionManagerRestaurantManagerRole(user.role)

    const CafeteriaId = params.id;
    const Cafeteria = await getCafeteriaById(
      CafeteriaId,
      user.hotelId,
      
    );

    return NextResponse.json(Cafeteria, { status: 200 });
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
    
    checkAdminReceptionManagerRestaurantManagerRole(user.role)

    const CafeteriaId = params.id;
    const deletedCafeteria = await deleteCafeteria(
      CafeteriaId,
      user.hotelId,
      
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
    checkAdminReceptionManagerRestaurantManagerRole(user.role)
    const CafeteriaId = params.id;
    const updateData:UpdateCafeteriaData = await request.json();

    const updatedCafeteria = await updateCafeteria(
      CafeteriaId,
      user.hotelId,
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
