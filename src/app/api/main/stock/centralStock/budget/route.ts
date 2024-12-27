import { NextRequest, NextResponse } from "next/server";
import {
  addOrUpdateBudgets,
  checkAdminReceptionManagerStockManagerRole,
  getAllBudgets,
} from "@/app/api/main/stock/centralStock/budget/controller";
import {
  AddMultipleBudgetsData
  
} from "@/app/api/main/stock/centralStock/budget/types";
import { handleError } from "@/lib/error_handler/handleError";
import { getUser } from "@/lib/token/getUserFromToken";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const user = getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non Authorisé" }, { status: 401 });
    }
    checkAdminReceptionManagerStockManagerRole(user.role);
    const data: AddMultipleBudgetsData = await request.json();
    
    const newBudget = await addOrUpdateBudgets(data, user.hotelId);

    return NextResponse.json(
      {
        message: "nouvelle Budget a été ajouté avec succès",
      },
      { status: 201 }
    );
  } catch (error) {
    return handleError(error);
  }
}
////////////////////////// get ////////////////////////////////
export async function GET(request: NextRequest) {
  try {
    const user = getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non Authorisé" }, { status: 401 });
    }

    const { hotelId, id: userId, role: userRole } = user;

    const BudgetsResult = await getAllBudgets(hotelId, userId, userRole);

    return NextResponse.json(BudgetsResult, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}
