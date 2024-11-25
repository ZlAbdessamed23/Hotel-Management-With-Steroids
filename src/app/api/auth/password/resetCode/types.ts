import { Prisma } from "@prisma/client";

export type ResetCodeData = {
  email: string;
  resetCode : string
  collection: "admin" | "employee";
};

export const requiredResetCodeFields: (keyof ResetCodeData)[] = [
  "email",
  "resetCode",
  "collection",
];

export type Admin = Prisma.AdminGetPayload<{
  include: {
    hotel: { include: { subscription: { include: { plan: true } } } };
  };
}>;
export type Employee = Prisma.EmployeeGetPayload<{
  include: {
    hotel: { include: { subscription: { include: { plan: true } } } };
  };
}>;

export type User = Admin | Employee;
export type Plan = Prisma.PlanGetPayload<{}>

// Define the structure for sign-in result
export type ResetCodeResult =
  | {
      user: User;
      hotelToken : string
    }
  | { redirectUrl: string }
  | { employeeMessage: string };
