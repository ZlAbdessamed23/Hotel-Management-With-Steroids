import { NextRequest, NextResponse } from "next/server";
// Adjust the import path as needed
import {
  AddCalendarData,
  requiredCalendarFields,
} from "@/app/api/main/calendar/types";
import {
  addCalendar,
  checkAdminRole,
  getCalendars,
} from "@/app/api/main/calendar/controller";

import { handleError } from "@/lib/error_handler/handleError";
import { getUser } from "@/lib/token/getUserFromToken";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const user = getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non Authorisé" }, { status: 401 });
    }
    console.log(user);
    checkAdminRole(user.role);

    const data: AddCalendarData = await request.json();
    const missingFields = requiredCalendarFields.filter(
      (field) => !data[field]
    );
    if (missingFields.length > 0) {
      return NextResponse.json(
        { message: `${missingFields.join(",")} est requis` },
        { status: 400 }
      );
    }

    const newCalendar = await addCalendar(data, user.hotelId);

    return NextResponse.json(
      { message: "Calendrier créé avec succès" },
      { status: 201 }
    );
  } catch (error) {
    return handleError(error);
  }
}
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const user = getUser(request);
    if (!user) {
      return NextResponse.json({ error: "Non Authorisé" }, { status: 401 });
    }
    console.log(user);

    const Calendars = await getCalendars(user.hotelId);

    return NextResponse.json(Calendars, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}
