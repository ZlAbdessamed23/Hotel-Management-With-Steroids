import {
  NotFoundError,
  
} from "@/lib/error_handler/customerErrors";
import { throwAppropriateError } from "@/lib/error_handler/throwError";
import { HotelInfo } from "@/app/api/main/bill/types";
import prisma from "@/lib/prisma/prismaClient";
import { UserRole } from "@prisma/client";

export async function getHotel(hotelId: string): Promise<HotelInfo> {
  try {
    const hotel = await prisma.hotel.findUnique({
      where: { id: hotelId },
      select: {
        hotelName: true,
        hotelAddress: true,
        hotelEmail: true,
        hotelPhoneNumber: true,
        country: true,
      },
    });

    if (!hotel) {
      throw new NotFoundError("Hotel non trouvé");
    }

    return { Hotel: hotel };
  } catch (error) {
    throwAppropriateError(error);
  }
}
