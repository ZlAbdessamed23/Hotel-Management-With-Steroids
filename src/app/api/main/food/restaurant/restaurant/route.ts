import { NextRequest, NextResponse } from "next/server";
import { AddRestaurantData, requiredRestaurantFields } from "@/app/api/main/food/restaurant/restaurant/types";
import { addRestaurant, getAllRestaurants,checkAdminReceptionManagerRestaurantManagerRole } from "@/app/api/main/food/restaurant/restaurant/controller";
import { handleError } from "@/lib/error_handler/handleError";
import { getUser } from "@/lib/token/getUserFromToken";

export async function POST(request: NextRequest): Promise<NextResponse> {
    try {
      const user = getUser(request);
      if (!user) {
        return NextResponse.json({ error: "Non Authorisé" }, { status: 401 });
      }
      
      checkAdminReceptionManagerRestaurantManagerRole(user.role)
  
      const data: AddRestaurantData = await request.json();
      const missingFields = requiredRestaurantFields.filter(
        (field) => !data[field]
      );
      if (missingFields.length > 0) {
        return NextResponse.json(
          { message: `${missingFields.join(", ")}: sont requis ` },
          { status: 400 }
        );
      }
  
      const newRestaurant = await addRestaurant(
        data,
        user.hotelId,
        
      );
  
      return NextResponse.json(
        { message: "Restaurant crée avec succès" },
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
      
  
      const Restaurants = await getAllRestaurants(user.hotelId);
      return NextResponse.json(Restaurants, { status: 200 });
    } catch (error) {
      return handleError(error);
    }
  }