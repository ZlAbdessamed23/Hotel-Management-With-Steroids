import { Prisma } from "@prisma/client";

export type EmployeesResult = {
  Employees: Prisma.EmployeeGetPayload<{select : {
    id : true,firstName : true,
    lastName : true,
    email  : true,
    address : true,
    dateOfBirth : true,
    gender : true,
    departement : true,
    role : true,
    phoneNumber : true,
    workingDays : true,
    state : true,
     
  }}>[];
};
