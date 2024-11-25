import { Prisma, UserGender } from "@prisma/client";

export type AdminWithHotelInfo = {
  Admin: Prisma.AdminGetPayload<{
    select: {
      firstName: true;
      lastName: true;
      address: true;
      dateOfBirth: true;
      email: true;
      phoneNumber: true;
      gender: true;
      nationality: true;
      hotel: {
        select: {
          id: true;
          hotelName: true;
          hotelAddress: true;
          country: true;
          hotelPhoneNumber: true;
          hotelEmail: true;
          cardNumber: true;
        };
      };
    };
  }>;
};
export type UpdateAdminData = {
  firstName?: string;
  lastName?: string;
  address?: string;
  dateOfBirth?: Date;

  phoneNumber?: string;
  gender?: UserGender;
  nationality?: string;

  isActivated?: boolean;
  password?: string;
};
export type Admin = {
  Admin: Prisma.AdminGetPayload<{
    select: {
      id: true;
      firstName: true;
      lastName: true;
      address: true;
      dateOfBirth: true;

      phoneNumber: true;
      gender: true;
      nationality: true;
    };
  }>;
};
