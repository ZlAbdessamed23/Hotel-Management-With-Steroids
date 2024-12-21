import {
  DaysOfWeek,
  Departements,
  EmployeeState,
  Prisma,
  UserGender,
  UserRole,
} from "@prisma/client";

export type EmployeeWithTasks = {
  Employee: Prisma.EmployeeGetPayload<{
    select: {
      id: true;
      firstName: true;
      lastName: true;
      address: true;
      dateOfBirth: true;
      email: true;
      phoneNumber: true;
      gender: true;
      nationality: true;
      departement: true;
      role: true;
      state: true;
      employeeTask: {
        select: {
          task: {
            select: {
              id: true;
              title: true;
              description: true;
              deadline: true;
              isDone: true;
              createdByAdmin: {
                select: {
                  firstName: true;
                  lastName: true;
                };
              };
              createdByEmployee: {
                select: {
                  firstName: true;
                  lastName: true;
                };
              };
            };
          };
        };
      };
      note: { 
        select: { 
          title: true; 
          description: true; 
          deadline: true;
        };
      };
    };
  }>;
};
export type UpdateEmployeeData = {
  firstName?: string;
  lastName?: string;
  address?: string;
  dateOfBirth?: Date;

  phoneNumber?: string;
  gender?: UserGender;
  nationality?: string;

  state?: EmployeeState;
  isActivated?: boolean;
  password?: string;
};
export type Employee = {
  Employee: Prisma.EmployeeGetPayload<{
    select: {
      id: true;
      firstName: true;
      lastName: true;
      address: true;
      dateOfBirth: true;

      phoneNumber: true;
      gender: true;
      nationality: true;
      role: true;
      departement: true;
      workingDays: true;
      state: true;
    };
  }>;
};
