import prisma from "@/lib/prisma/prismaClient";
import { TaskResult, UpdateTaskData } from "./types";
import {
  NotFoundError,
  UnauthorizedError,
} from "@/lib/error_handler/customerErrors";

import { UserRole, Departements, Prisma } from "@prisma/client";
import { throwAppropriateError } from "@/lib/error_handler/throwError";
import { updateTaskStatistics } from "@/app/api/main/statistics/statistics";
export async function updateTask(
  taskId: string,
  hotelId: string,
  userId: string,
  userRole: UserRole[],
  data: UpdateTaskData
): Promise<TaskResult> {
  try {
    return await prisma.$transaction(async (prisma) => {
      // Fetch only necessary fields
      const existingTask = await prisma.task.findUnique({
        where: { id: taskId },
        select: {
          createdByEmployeeId: true,
          createdByAdminId: true,
          assignedEmployees: {
            select: { id: true, employeeId: true },
          },
        },
      });

      if (!existingTask) {
        throw new NotFoundError(`Tache non trouvée`);
      }

      // Check authorization
      if (
        existingTask.createdByEmployeeId !== userId &&
        existingTask.createdByAdminId !== userId
      ) {
        throw new UnauthorizedError(
          "Non Authorisé"
        );
      }

      // Prepare update data
      const updateData: Prisma.TaskUpdateInput = {};
      if (data.title !== undefined) updateData.title = data.title;
      if (data.description !== undefined)
        updateData.description = data.description;
      if (data.deadline !== undefined) updateData.deadline = data.deadline;
      if (data.isDone !== undefined) updateData.isDone = data.isDone;

      // Handle employee assignments
      if (data.employeeAssignedTask?.length) {
        const newEmployeeIds = new Set(
          data.employeeAssignedTask.map((ea) => ea.employeeId)
        );
        const existingEmployeeIds = new Set(
          existingTask.assignedEmployees.map((ae) => ae.employeeId)
        );

        // Check department validity if not admin
        if (!userRole.includes(UserRole.admin)) {
          const newAssignedEmployees = await prisma.employee.findMany({
            where: {
              id: { in: Array.from(newEmployeeIds) },
              hotelId: hotelId,
            },
            select: { id: true, departement: true },
          });

          if (newAssignedEmployees.length !== newEmployeeIds.size) {
            throw new NotFoundError("Un ou plus des employées non trouvés");
          }

          // Determine allowed departments based on user roles
          const allowedDepartments: Departements[] = [];
          if (userRole.includes(UserRole.reception_Manager)) {
            allowedDepartments.push(Departements.reception);
          }
          if (userRole.includes(UserRole.restaurent_Manager)) {
            allowedDepartments.push(Departements.restauration);
          }

          // Check if any new employee is outside of allowed departments
          const invalidAssignment = newAssignedEmployees.some((emp) => {
            const hasValidDepartment = emp.departement.some(dept => 
              allowedDepartments.includes(dept)
            );
            return !hasValidDepartment;
          });

          if (invalidAssignment) {
            throw new UnauthorizedError(
              "Les employées séléctionnés n'appartiennent pas à votre département"
            );
          }
        }

        updateData.assignedEmployees = {
          deleteMany: {
            employeeId: { notIn: Array.from(newEmployeeIds) },
          },
          create: Array.from(newEmployeeIds)
            .filter((id) => !existingEmployeeIds.has(id))
            .map((employeeId) => ({ employeeId })),
        };
      }

      // Update the task if there are changes
      if (Object.keys(updateData).length > 0) {
        const updatedTask = await prisma.task.update({
          where: { id: taskId },
          data: updateData,
          include: {
            assignedEmployees: {
              include: {
                employee: true,
              },
            },
          },
        });

        return { Task: updatedTask };
      } else {
        // If no changes, fetch full task details
        const fullTask = await prisma.task.findUnique({
          where: { id: taskId },
          include: {
            assignedEmployees: {
              include: {
                employee: true,
              },
            },
          },
        });
        return { Task: fullTask };
      }
    });
  } catch (error) {
    throwAppropriateError(error);
  }
}
//////////////////////// get task by id ///////////////////////////////
export async function getTaskById(
  taskId: string,
  userId: string,
  userRole: UserRole[]
): Promise<TaskResult> {
  try {
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: {
        assignedEmployees: {
          include: {
            employee: true,
          },
        },
        createdByEmployee: true,
        createdByAdmin: true,
        hotel: true,
      },
    });

    if (!task) {
      throw new NotFoundError(`Task non trouvée`);
    }

    const isAdmin = userRole.includes(UserRole.admin);
    const isCreator =
      task.createdByEmployeeId === userId || task.createdByAdminId === userId;
    const isAssigned = task.assignedEmployees.some(
      (ae) => ae.employee.id === userId
    );

    if (!isAdmin && !isCreator && !isAssigned) {
      throw new UnauthorizedError(
        "Non Authorisé"
      );
    }

    return { Task: task };
  } catch (error) {
    throw throwAppropriateError(error);
  }
}
///////////////////////// delete task //////////////////////////////////
export async function deleteTask(
  taskId: string,
  userId: string,
  hotelId: string,
  userRole: UserRole[]
): Promise<TaskResult> {
  try {
    return await prisma.$transaction(async (prisma) => {
      const task = await prisma.task.findUnique({
        where: { id: taskId },
        include: {
          createdByEmployee: true,
          createdByAdmin: true,
        },
      });

      if (!task) {
        throw new NotFoundError(`Task non trouvée`);
      }

      const isCreator =
        task.createdByEmployeeId === userId || task.createdByAdminId === userId;

      if (!isCreator) {
        throw new UnauthorizedError(
          "Non Authorisé"
          );
      }

      // Then delete the task
      const deletedTask = await prisma.task.delete({
        where: { id: taskId },
      });
      await updateTaskStatistics(hotelId, "remove", prisma);
      return { Task: deletedTask };
    });
  } catch (error) {
    throw throwAppropriateError(error);
  }
}
