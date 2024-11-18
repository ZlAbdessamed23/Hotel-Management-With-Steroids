import { NextRequest, NextResponse } from "next/server";
import { AddCafeteriaData, requiredCafeteriaFields } from "@/app/api/main/food/cafeteria/cafeteria/types";
import { addCafeteria, getAllCafeterias,checkAdminRole } from "@/app/api/main/food/cafeteria/cafeteria/controller";
import { handleError } from "@/lib/error_handler/handleError";
import { getUser } from "@/lib/token/getUserFromToken";

export async function POST(request: NextRequest): Promise<NextResponse> {
    try {
      const user = getUser(request);
      if (!user) {
        return NextResponse.json({ error: "Non Authorisé" }, { status: 401 });
      }
      console.log(user);
      checkAdminRole(user.role)
  
      const data: AddCafeteriaData = await request.json();
      const missingFields = requiredCafeteriaFields.filter(
        (field) => !data[field]
      );
      if (missingFields.length > 0) {
        return NextResponse.json(
          { message: `${missingFields.join(", ")}: sont requis ` },
          { status: 400 }
        );
      }
  
      const newCafeteria = await addCafeteria(
        data,
        user.hotelId,
        
      );
  
      return NextResponse.json(
        { message: "Cafeteria crée avec succès" },
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
  
      const Cafeterias = await getAllCafeterias(user.hotelId);
      return NextResponse.json(Cafeterias, { status: 200 });
    } catch (error) {
      return handleError(error);
    }
  }