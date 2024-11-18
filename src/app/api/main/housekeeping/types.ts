import { Prisma } from "@prisma/client";

export type EmployeesResult = {
  Employees: Prisma.EmployeeGetPayload<{include:{employeeTask:{include:{task:true}}}}>[];
};
