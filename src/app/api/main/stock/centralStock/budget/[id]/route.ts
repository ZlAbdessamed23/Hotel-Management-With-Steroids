import { getUser } from "@/lib/token/getUserFromToken";
import { NextRequest, NextResponse } from "next/server";
import {
  checkAdminRole,
  updateBudget,
} from "@/app/api/main/stock/centralStock/budget/[id]/controller";
import { handleError } from "@/lib/error_handler/handleError";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const user = getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non Authorisé" }, { status: 401 });
    }
    checkAdminRole(user.role);
    const budgetId = params.id;
    const updateData = await request.json();

    const updatedBudget = await updateBudget(
      budgetId,

      user.hotelId,
      updateData
    );

    return NextResponse.json(
      {
        message: "Budget mise à jour avec succès",
      },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error);
  }
}
