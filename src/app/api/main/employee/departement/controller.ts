import { Departements, Prisma, UserRole } from "@prisma/client";
import prisma from "@/lib/prisma/prismaClient";
import { EmployeeBasicInfo } from "@/app/api/main/employee/departement/types";

export async function getDepartmentEmployees(
  hotelId: string,
  userRoles: UserRole[]
): Promise<EmployeeBasicInfo> {
  const isAdmin = userRoles.includes(UserRole.admin);
  const userDepartments: Departements[] = [];

  if (userRoles.includes(UserRole.restaurent_Manager)) {
    userDepartments.push(Departements.restauration);
  }
  if (userRoles.includes(UserRole.reception_Manager)) {
    userDepartments.push(Departements.reception);
  }
  if (!isAdmin && userDepartments.length === 0) return {Employees:[]};

  // If user has both departments or is admin, don't filter by department
  const shouldFilterByDepartment = !isAdmin && userDepartments.length === 1;
  const Employees=await prisma.employee.findMany({
    where: {
      hotelId,
      ...(shouldFilterByDepartment
        ? {
            departement: {
              has: userDepartments[0] // Filter by single department
            }
          }
        : {} // No department filter if user has both departments or is admin
      ),
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
    },
  });

  return {Employees:Employees}
}
