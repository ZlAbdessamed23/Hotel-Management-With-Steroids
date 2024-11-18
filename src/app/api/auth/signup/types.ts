import { Prisma, UserGender } from "@prisma/client";

export type AdminSignupData = {
  firstName: string;
  lastName: string;
  address: string;
  dateOfBirth: Date;
  email: string;
  phoneNumber: string;
  gender: UserGender;
  nationality: string;
  password: string;
  hotelName:string;
  hotelAddress: string;
  country: string;
  hotelPhoneNumber: string;
  hotelEmail: string;
  cardNumber: string;
  planId: string;
};

export const requiredFields: (keyof AdminSignupData)[] = [
  "firstName",
  "lastName",
  "address",
  "dateOfBirth",
  "email",
  "phoneNumber",
  "gender",
  "nationality",
  "password",
  "hotelName",
  "hotelAddress",
  "country",
  "hotelPhoneNumber",
  "hotelEmail",
  "cardNumber",
  "planId",
];


export type AdminSignupResult = {
  admin: Prisma.AdminGetPayload<{
    include: {
      hotel: {
        include: {
          subscription: true;
        };
      };
    };
  }>;
  token: string;
};
