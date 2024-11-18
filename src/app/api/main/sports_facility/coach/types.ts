import { Prisma } from "@prisma/client";
export type Coaches = {
  coaches: Prisma.EmployeeGetPayload<{
    select: { id: true; lastName: true; firstName: true };
  }>[];
};
