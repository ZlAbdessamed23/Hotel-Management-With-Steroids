import { getUser } from "@/lib/token/getUserFromToken";
import { NextRequest, NextResponse } from "next/server";
import {
  
  deleteRestaurantMenu,
  getRestaurantMenuById,
  updateRestaurantMenu,
} from "./controller";
import { handleError } from "@/lib/error_handler/handleError";

export async function GET(
  request: NextRequest,
  { params }: { params: { restaurantId:string,id: string } }
): Promise<NextResponse> {
  try {
    const user = getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non Authorisé" }, { status: 401 });
    }
    console.log(user);
    

    const {restaurantId,id} = params;
    const menu = await getRestaurantMenuById(id,restaurantId, user.hotelId,user.id,user.role);

    return NextResponse.json(menu, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { restaurantId:string,id: string } }
): Promise<NextResponse> {
  try {
    const user = getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non Authorisé" }, { status: 401 });
    }
    

    const {restaurantId,id} = params;
    const menu = await deleteRestaurantMenu(id,restaurantId, user.hotelId,user.id,user.role);

    return NextResponse.json(
      { message: "Restaurant menu supprimé avec succès" },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: {restaurantId:string, id: string } }
): Promise<NextResponse> {
  try {
    const user = getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non Authorisé" }, { status: 401 });
    }
    
    const {restaurantId,id} = params;
    
    const updateData = await request.json();

    const updatedMenu = await updateRestaurantMenu(
      id,restaurantId, user.hotelId,user.id,user.role,
      updateData
    );

    return NextResponse.json(
      { message: "Restaurant menu mis à jour avec succès" },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error);
  }
}
