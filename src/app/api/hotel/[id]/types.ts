import { Prisma } from "@prisma/client";

export type HotelInfo = {
  Hotel: Prisma.HotelGetPayload<{
    select: {
      hotelName: true;
      hotelAddress: true;
      hotelEmail: true;
      hotelPhoneNumber: true;
      country: true;
      cardNumber: true;
      admin: {
        select: {
          firstName: true;
          lastName: true;
          phoneNumber: true;
          email: true;
          nationality: true;
        };
      };
    };
  }>;
};
