// types/signin.types.ts

import { Prisma } from "@prisma/client";



export type SignInData = {
  email: string;
  password: string;
  collection: "admin" | "employee";
};

export const requiredSignInFields: (keyof SignInData)[] = [
  "email",
  "password",
  "collection",
];

export type Admin = Prisma.AdminGetPayload<{
  include: {
    hotel: { include: { subscription: { include: { plan: true } } } };
  };
}>;
export type Plan = Prisma.PlanGetPayload<{}>;
export type Employee = Prisma.EmployeeGetPayload<{
  include: {
    hotel: { include: { subscription: { include: { plan: true } } } };
  };
}>;

export type User = Admin | Employee;

// Define the structure for sign-in result
export type SignInResult =
  | {
    user: User;
      hotelToken: string;
      
    }
  | { redirectUrl: string }
  | { employeeMessage: string };
