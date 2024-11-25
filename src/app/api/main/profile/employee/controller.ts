import prisma from "@/lib/prisma/prismaClient";
import {
  Employee,
  EmployeeWithTasks,
  UpdateEmployeeData,
} from "@/app/api/main/profile/employee/types";
import { NotFoundError } from "@/lib/error_handler/customerErrors";
import {
  DaysOfWeek,
  Departements,
  EmployeeState,
  Prisma,
  UserGender,
  UserRole,
} from "@prisma/client";
import { throwAppropriateError } from "@/lib/error_handler/throwError";
import bcrypt from "bcrypt";
export async function getEmployeeWithTasks(
  employeeId: string
): Promise<EmployeeWithTasks> {
  try {
    const employee = await prisma.employee.findUnique({
      where: { id: employeeId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        address: true,
        dateOfBirth: true,
        email: true,
        phoneNumber: true,
        gender: true,
        departement: true,
        role: true,
        state: true,
        nationality: true,
        employeeTask: {
          select: {
            task: {
              select: {
                id: true,
                title: true,
                description: true,
                deadline: true,
              },
            },
          },
        },
        note: { select: { title: true, description: true, deadline: true } },
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
///////////////////////// update /////////////////////////
export async function updateProfile(
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

    if (data.phoneNumber) updateData.phoneNumber = data.phoneNumber;
    if (data.gender) updateData.gender = data.gender as UserGender;
    if (data.nationality) updateData.nationality = data.nationality;

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
async function hashPassword(password: string): Promise<string> {
  try {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  } catch (error) {
    throwAppropriateError(error);
  }
}
