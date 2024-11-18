import { Prisma } from "@prisma/client";

export type UpdateTaskData = {
  title?: string;
  description?: string;
  deadline?: Date;
  isDone : boolean;
  employeeAssignedTask?: {
    employeeId: string;
  }[];
};

export type TaskResult = {
  Task: Prisma.TaskGetPayload<{}> | null;
};
