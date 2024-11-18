import { Prisma } from "@prisma/client";

export type AddTaskData = {
  title: string;
  description: string;
  deadline: Date;

  employeeAssignedTask: {
    employeeId: string;
  }[];
};

export const requiredTaskFields: (keyof AddTaskData)[] = [
  "title",
  "description",
  "deadline",
  "employeeAssignedTask",
];

export type TaskResult = {
  Task: Prisma.TaskGetPayload<{}>;
};

export type TasksResult = {
  Tasks: Prisma.TaskGetPayload<{}>[];
};
