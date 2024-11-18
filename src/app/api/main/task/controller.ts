import prisma from "@/lib/prisma/prismaClient";
import { AddTaskData, TaskResult, TasksResult } from "./types";
import {
  LimitExceededError,
  NotFoundError,
  SubscriptionError,
  UnauthorizedError,
} from "@/lib/error_handler/customerErrors";
import { UserRole, Departements } from "@prisma/client";
import { throwAppropriateError } from "@/lib/error_handler/throwError";
import { updateTaskStatistics } from "@/app/api/main/statistics/statistics";

export async function addTask(
  data: AddTaskData,
  hotelId: string,
  userId: string,
  userRole: UserRole[]
): Promise<TaskResult> {
  try {
    return await prisma.$transaction(async (prisma) => {
      const [hotel, assignedEmployees] = await Promise.all([
        prisma.hotel.findUnique({
          where: { id: hotelId },
          select: {
            subscription: {
              select: {
                plan: {
                  select: {
                    maxTasks: true,
                  },
                },
              },
            },
            admin: {
              select: { id: true },
            },
            _count: { select: { task: true } },
          },
        }),
        prisma.employee.findMany({
          where: {
            id: { in: data.employeeAssignedTask.map((ea) => ea.employeeId) },
            hotelId: hotelId,
          },
          select: {
            id: true,
            departement: true,
          },
        }),
      ]);

      if (!hotel) throw new NotFoundError("Hotel non trouvé");
      if (!hotel.subscription?.plan)
        throw new SubscriptionError(
          "Hotel n'a pas de plan d'abonnement active"
        );

      if (hotel._count.task >= hotel.subscription.plan.maxTasks) {
        throw new LimitExceededError(
          "Le nombre Maximum des taches pour ce plan est déja atteint"
        );
      }

      const isAdmin = userRole.includes(UserRole.admin);
      const isReceptionManager = userRole.includes(UserRole.reception_Manager);
      const isRestaurantManager = userRole.includes(
        UserRole.restaurent_Manager
      );

      // Check if user has any required role
      if (!isAdmin && !isReceptionManager && !isRestaurantManager) {
        throw new UnauthorizedError(
          "Utilisateur non authorisé de créer des taches "
        );
      }

      if (assignedEmployees.length !== data.employeeAssignedTask.length) {
        console.log(assignedEmployees, data.employeeAssignedTask);
        throw new NotFoundError(
          "Un ou plus d'employées assignés ne sont pas trouvés"
        );
      }

      // Handle department validation for non-admin users
      if (!isAdmin) {
        // Determine allowed departments based on user roles
        const allowedDepartments: Departements[] = [];
        if (isReceptionManager) allowedDepartments.push(Departements.reception);
        if (isRestaurantManager)
          allowedDepartments.push(Departements.restauration);

        // Check if any assigned employee's departments intersect with allowed departments
        const invalidAssignment = assignedEmployees.some((emp) => {
          const hasValidDepartment = emp.departement.some((dept) =>
            allowedDepartments.includes(dept)
          );
          return !hasValidDepartment;
        });

        if (invalidAssignment) {
          throw new UnauthorizedError(
            "assigner des taches pour des employées dehors ton département n'est pas possible"
          );
        }
      }

      const createdTask = await prisma.task.create({
        data: {
          title: data.title,
          description: data.description,
          deadline: new Date(data.deadline),
          hotelId: hotelId,
          ...(isAdmin
            ? { createdByAdminId: userId }
            : { createdByEmployeeId: userId }),
          assignedEmployees: {
            create: assignedEmployees.map((emp) => ({
              employeeId: emp.id,
            })),
          },
        },
        include: {
          assignedEmployees: {
            include: {
              employee: true,
            },
          },
        },
      });

      await updateTaskStatistics(hotelId, "add", prisma);
      return { Task: createdTask };
    });
  } catch (error) {
    throwAppropriateError(error);
  }
}

export async function getAllTasks(hotelId: string): Promise<TasksResult> {
  try {
    const tasks = await prisma.task.findMany({
      where: { hotelId: hotelId },
      include: {
        assignedEmployees: {
          include: {
            employee: {
              select: {
                firstName: true,
                lastName: true,
                id: true,
                role: true,
              },
            },
          },
        },
      },
    });

    return { Tasks: tasks };
  } catch (error) {
    throwAppropriateError(error);
  }
}
/////////////////////////// functions //////////////////////////////////
export function checkRestaurantManagerReceptionManagerAdminRole(
  roles: UserRole[]
) {
  if (
    !roles.includes(UserRole.restaurent_Manager) &&
    !roles.includes(UserRole.admin) &&
    !roles.includes(UserRole.reception_Manager)
  ) {
    throw new UnauthorizedError(
      "Sauf restaurant manager, admin, et reception manager peut ajouter des taches"
    );
  }
}
