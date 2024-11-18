import { throwAppropriateError } from "@/lib/error_handler/throwError";
import prisma from "@/lib/prisma/prismaClient";
import { EmployeeBasicInfo } from "./types";

export async function getEmployeesForReport(
  hotelId: string
): Promise<EmployeeBasicInfo> {
  try {

    // Fetch all employees excluding sensitive fields
    const employees = await prisma.employee.findMany({
      where: { hotelId: hotelId },
      select: {
        id: true,
        firstName: true,
        lastName: true,

        role: true,
      },
    });

    

    return { Employees: employees };
  } catch (error) {
    throwAppropriateError(error);
  }
}
