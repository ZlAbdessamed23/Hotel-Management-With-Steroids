// Update your controller file (e.g., ./controller.ts)

// ... keep your existing imports and functions ...
import prisma from "@/lib/prisma/prismaClient";
import {
  Employee,
  UpdateEmployeeData,
} from "@/app/api/main/employee/[id]/types";

import {
  ForbiddenError,
  NotFoundError,
} from "@/lib/error_handler/customerErrors";

import { throwAppropriateError } from "@/lib/error_handler/throwError";
import {
  DaysOfWeek,
  EmployeeState,
  UserGender,
  UserRole,
  Prisma,
  Departements,
} from "@prisma/client";
import bcrypt from "bcrypt";
import { updateEmployeeStatistics } from "@/app/api/main/statistics/statistics";

///////////////////// get user by id /////////////////////////////////
export async function getEmployeeById(
  employeeId: string,
  hotelId: string
): Promise<Employee> {
  try {
    const employee = await prisma.employee.findFirst({
      where: {
        id: employeeId,
        hotelId: hotelId,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        address: true,
        dateOfBirth: true,
        email: true,
        phoneNumber: true,
        gender: true,
        nationality: true,
        role: true,
        departement: true,
        workingDays: true,
        state: true,
      },
    });

    if (!employee) {
      throw new NotFoundError("Employée non trouvé");
    }

    return { Employee: employee };
  } catch (error) {
    throwAppropriateError(error);
  }
}
//////////////////////// delete user by id //////////////////////////////////////
export async function deleteEmployeeById(
  employeeId: string,
  hotelId: string
): Promise<Employee> {
  try {
    const deletedEmployee = await prisma.employee.delete({
      where: {
        id: employeeId,
        hotelId: hotelId,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        address: true,
        dateOfBirth: true,
        email: true,
        phoneNumber: true,
        gender: true,
        nationality: true,
        role: true,
        departement: true,
        workingDays: true,
        state: true,
      },
    });

    await updateEmployeeStatistics(hotelId, "remove", prisma);

    return { Employee: deletedEmployee };
  } catch (error) {
    throwAppropriateError(error);
  }
}

////////////////////////////// update ///////////////////////////////////

export async function updateEmployee(
  employeeId: string,
  hotelId: string,
  data: UpdateEmployeeData
): Promise<Employee> {
  try {
    let updateData: Prisma.EmployeeUpdateInput = {};

    // Map UpdateEmployeeData to EmployeeUpdateInput
    if (data.firstName) updateData.firstName = data.firstName;
    if (data.lastName) updateData.lastName = data.lastName;
    if (data.address) updateData.address = data.address;
    if (data.dateOfBirth) updateData.dateOfBirth = data.dateOfBirth;
    if (data.email) updateData.email = data.email;
    if (data.phoneNumber) updateData.phoneNumber = data.phoneNumber;
    if (data.gender) updateData.gender = data.gender as UserGender;
    if (data.nationality) updateData.nationality = data.nationality;
    if (data.role) updateData.role = data.role as UserRole[];
    if (data.departement)
      updateData.departement = data.departement as Departements[];
    if (data.workingDays)
      updateData.workingDays = data.workingDays as DaysOfWeek[];
    if (data.state) updateData.state = data.state as EmployeeState;
    if (data.isActivated !== undefined)
      updateData.isActivated = data.isActivated;

    // If password is provided, hash it
    if (data.password) {
      updateData.password = await hashPassword(data.password);
    }

    const updatedEmployee = await prisma.employee.update({
      where: {
        id: employeeId,
        hotelId: hotelId,
      },
      data: updateData,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        address: true,
        dateOfBirth: true,
        email: true,
        phoneNumber: true,
        gender: true,
        nationality: true,
        role: true,
        departement: true,
        workingDays: true,
        state: true,
      },
    });

    return { Employee: updatedEmployee };
  } catch (error) {
    throwAppropriateError(error);
  }
}

export function checkAdminRole(roles: UserRole[]) {
  if (!roles.includes(UserRole.admin)) {
    throw new ForbiddenError("Sauf l'Administrateur peut faire cette action");
  }
}
async function hashPassword(password: string): Promise<string> {
  try {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  } catch (error) {
    throwAppropriateError(error);
  }
}
