import prisma from "@/lib/prisma/prismaClient";
import { TaskResult, UpdateTaskData } from "@/app/api/main/task/[id]/types";
import {
  NotFoundError,
  UnauthorizedError,
} from "@/lib/error_handler/customerErrors";

import { UserRole,  Prisma } from "@prisma/client";
import { throwAppropriateError } from "@/lib/error_handler/throwError";
import { updateTaskStatistics } from "@/app/api/main/statistics/statistics";
export async function updateTask(
  taskId: string,
  data: UpdateTaskData
): Promise<TaskResult> {
  try {
    return await prisma.$transaction(async (prisma) => {
      const updateData: Prisma.TaskUpdateInput = {};
     

      // Basic fields update
      if (data.title !== undefined) updateData.title = data.title;
      if (data.description !== undefined) updateData.description = data.description;
      if (data.deadline !== undefined) updateData.deadline = new Date(data.deadline);
      if (data.isDone !== undefined) updateData.isDone = data.isDone;

      // Handle employee assignments if provided
      if (Array.isArray(data.employeeAssignedTask)) {
        const newEmployeeIds = data.employeeAssignedTask
          .filter(ea => ea.employeeId !== "") // Filter out empty employee IDs
          .map(ea => ea.employeeId);

        updateData.assignedEmployees = {
          deleteMany: {
            taskId,
          },
          ...(newEmployeeIds.length > 0 && {
            create: newEmployeeIds.map((employeeId) => ({
              employee: { connect: { id: employeeId } },
            })),
          }),
        };
      }

      // Update task if there are changes
      if (Object.keys(updateData).length > 0) {
        const updatedTask = await prisma.task.update({
          where: { id: taskId },
          data: updateData,
          
        });
        return { Task: updatedTask };
      }

      // If no changes, return existing task
      const existingTask = await prisma.task.findUnique({
        where: { id: taskId },
        
      });
      return { Task: existingTask };
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
