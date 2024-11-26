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
  Task: Prisma.TaskGetPayload<{select : {id : true,title : true,description : true,isDone : true,deadline : true,createdAt : true}}>;
};

export type TasksResult = {
  Tasks: Prisma.TaskGetPayload<{select : {id : true,title : true,description : true,isDone : true,deadline : true,createdAt : true}}>[];
};
