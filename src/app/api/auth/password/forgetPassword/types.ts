import { Prisma } from "@prisma/client";
export type ForgetPasswordData = {
  email: string;
  collection: "admin" | "employee";
};
export const requiredForgetPasswordFields: (keyof ForgetPasswordData)[] = [
  "email",
  "collection",
];
export type Admin = Prisma.AdminGetPayload<{}>;
export type Employee = Prisma.EmployeeGetPayload<{}>;
export type User = Admin | Employee