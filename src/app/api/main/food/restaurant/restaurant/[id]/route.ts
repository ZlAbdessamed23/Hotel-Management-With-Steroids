import { getUser } from "@/lib/token/getUserFromToken";
import { NextRequest, NextResponse } from "next/server";
import { updateRestaurant, getRestaurantById, deleteRestaurant, checkAdminReceptionManagerRestaurantManagerRole } from "@/app/api/main/food/restaurant/restaurant/[id]/controller";
import { UpdateRestaurantData } from "@/app/api/main/food/restaurant/restaurant/[id]/types";
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

    const RestaurantId = params.id;
    const Restaurant = await getRestaurantById(
      RestaurantId,
      user.hotelId,
      
    );

    return NextResponse.json(Restaurant, { status: 200 });
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

    const RestaurantId = params.id;
    const deletedRestaurant = await deleteRestaurant(
      RestaurantId,
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
    const RestaurantId = params.id;
    const updateData:UpdateRestaurantData = await request.json();

    const updatedRestaurant = await updateRestaurant(
      RestaurantId,
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
