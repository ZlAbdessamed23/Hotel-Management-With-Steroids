import { Prisma } from "@prisma/client";

export type AddTaskData = {
  title: string;
  description?: string;
  deadline: Date;

  employeeAssignedTask: {
    employeeId: string;
  }[];
};

export const requiredTaskFields: (keyof AddTaskData)[] = [
  "title",
  
  "deadline",
  "employeeAssignedTask",
];

export type TaskResult = {
  Task: Prisma.TaskGetPayload<{select : {id : true,title : true,description : true,isDone : true,deadline : true,createdAt : true}}>;
};

export type TasksResult = {
  Tasks: Prisma.TaskGetPayload<{select :{
    title :true,
    description :true,
    isDone :true,
    deadline :true,
    createdAt :true,
    id :true,
    assignedEmployees :{select:{employee :{select:{id :true,firstName :true,lastName:true}}}}
  }}>[];
};
