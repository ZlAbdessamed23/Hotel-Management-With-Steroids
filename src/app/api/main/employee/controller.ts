import prisma from "@/lib/prisma/prismaClient";
import {
  AddEmployeeData,
  Employee,
  Employees,
} from "@/app/api/main/employee/types";
import bcrypt from "bcrypt";

import {
  ConflictError,
  SubscriptionError,
  UnauthorizedError,
  ValidationError,
} from "@/lib/error_handler/customerErrors";

import { throwAppropriateError } from "@/lib/error_handler/throwError";
import { LimitExceededError } from "@/lib/error_handler/customerErrors";
import { UserRole } from "@prisma/client";
import { updateEmployeeStatistics } from "@/app/api/main/statistics/statistics";

/////////////////////////// Add employee //////////////////////////////////
export async function addEmployee(
  data: AddEmployeeData,
  hotelId: string
): Promise<Employee> {
  try {
    return await prisma.$transaction(async (prisma) => {
      const [hotel, employeeCount] = await Promise.all([
        prisma.hotel.findUnique({
          where: { id: hotelId },
          include: {
            subscription: {
              include: {
                plan: true,
              },
            },
          },
        }),
        prisma.employee.count({
          where: { hotelId },
        }),
      ]);

      if (!hotel) throw new ValidationError("Hotel non trouvé");
      if (!hotel.subscription?.plan)
        throw new SubscriptionError("Hotel n'a pas d'abonnement actif");

      const maxEmployees = hotel.subscription.plan.maxEmployees;
      if (employeeCount >= maxEmployees) {
        throw new LimitExceededError(
          "Le nombre Maximum des employées pour ce plan est déja atteint"
        );
      }

      const existingEmployee = await prisma.employee.findUnique({
        where: { email: data.email },
      });

      if (existingEmployee) {
        throw new ConflictError("Un employée avec ce email existe déja");
      }

      const hashedPassword = await hashPassword(data.password);

      const newEmployee = await prisma.employee.create({
        data: {
          ...data,
          password: hashedPassword,
          hotelId,
        },
      });

      // Update the statistics
      await updateEmployeeStatistics(hotelId, "add", prisma);

      return { Employee: newEmployee };
    });
  } catch (error) {
    throwAppropriateError(error);
  }
}
//////////////////////// Get all employee ////////////////////////////////
export async function getAllEmployees(hotelId: string): Promise<Employees> {
  try {
    // Fetch all employees excluding sensitive fields
    const employees = await prisma.employee.findMany({
      where: { hotelId: hotelId },
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

    return { Employees: employees };
  } catch (error) {
    throwAppropriateError(error);
  }
}

export function checkAdminRole(roles: UserRole[]) {
  if (!roles.includes(UserRole.admin)) {
    throw new UnauthorizedError(
      "Sauf l'Administrateur peut faire cette action"
    );
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
////////////////////// Statistics ///////////////////////////
