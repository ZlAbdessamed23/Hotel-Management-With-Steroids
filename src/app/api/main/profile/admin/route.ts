import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/token/getUserFromToken"; // Adjust the import path as needed
import {
  getAdminWithHotel,
  checkAdminRole,
  updateProfile,
} from "@/app/api/main/profile/admin/controller";
import { handleError } from "@/lib/error_handler/handleError";
import { UpdateAdminData } from "./types";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const user = getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.log(user);

    checkAdminRole(user.role);

    const adminWithHotel = await getAdminWithHotel(user.id, user.hotelId);
    return NextResponse.json(adminWithHotel, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}
///////////////////////////// patch //////////////////////////
export async function PATCH(request: NextRequest): Promise<NextResponse> {
  try {
    const user = getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non Authorisé" }, { status: 401 });
    }
    console.log(user);

    const updateData: UpdateAdminData = await request.json();

    await updateProfile(user.id, updateData);

    return NextResponse.json(
      { message: "Profile mis à jour avec succès" },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error);
  }
}
