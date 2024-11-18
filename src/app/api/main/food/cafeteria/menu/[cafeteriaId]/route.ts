import { handleError } from "@/lib/error_handler/handleError";
import { getUser } from "@/lib/token/getUserFromToken";
import { NextRequest, NextResponse } from "next/server";
import { getAllCafeteriaMenus } from "./controller";

export async function GET(request: NextRequest,{ params }: { params: { cafeteriaId:string } }) {
    try {
      const user = getUser(request);
      if (!user) {
        return NextResponse.json({ error: "Non Authorisé" }, { status: 401 });
      }
      console.log(user);
  
      const {cafeteriaId}=params
  
      const CafeteriaMenus = await getAllCafeteriaMenus(cafeteriaId,user.hotelId,user.id,user.role);
      return NextResponse.json(CafeteriaMenus, { status: 200 });
    } catch (error) {
      return handleError(error);
    }
  }