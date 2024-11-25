import { tasks } from "googleapis/build/src/apis/tasks";
import { EmployeesResult } from "./types";
import { throwAppropriateError } from "@/lib/error_handler/throwError";
import prisma from "@/lib/prisma/prismaClient";
import { UserRole } from "@prisma/client";
import { UnauthorizedError } from "@/lib/error_handler/customerErrors";

export async function getAllHouseKeeping(hotelId: string): Promise<EmployeesResult> {
    try {
      // Fetch all employees excluding sensitive fields
      const employees = await prisma.employee.findMany({
        where: { hotelId: hotelId },
        select : {
          id : true,firstName : true,
          lastName : true,
          email  : true,
          address : true,
          dateOfBirth : true,
          gender : true,
          departement : true,
          role : true,
          phoneNumber : true,
          workingDays : true,
          state : true,
           
        }});
  
      return { Employees: employees };
    } catch (error) {
      throwAppropriateError(error);
    }
  }


  export function checkReceptionManagerReceptionistGouvernementAdminRole(roles: UserRole[]) {
    if (
      !roles.includes(UserRole.reception_Manager) &&
      !roles.includes(UserRole.receptionist)&& !roles.includes(UserRole.gouvernante)&& !roles.includes(UserRole.admin)
    ) {
      throw new UnauthorizedError(
        "Sauf receptionist , reception , gouvernement , admin peut faire cette action"
      );
    }
  }