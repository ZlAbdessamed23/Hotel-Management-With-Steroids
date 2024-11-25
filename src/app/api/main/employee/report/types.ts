import { Prisma } from "@prisma/client";

export type EmployeeBasicInfo = {
  Employees: Prisma.EmployeeGetPayload<{
    select: { id: true; firstName: true; lastName: true; role: true };
  }>[];
};
