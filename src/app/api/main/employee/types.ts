// types.ts
import {
  UserGender,
  UserRole,
  Departements,
  DaysOfWeek,
  EmployeeState,
  
  Prisma,
} from "@prisma/client";

export type AddEmployeeData = {
  firstName: string;
  lastName: string;
  address: string;
  phoneNumber: string;
  dateOfBirth: string;
  email: string;
  gender: UserGender;
  nationality: string;
  password: string;
  role: UserRole[];
  departement: Departements[];
  workingDays?: DaysOfWeek[];
  state?: EmployeeState;
};

export const requiredFields: (keyof AddEmployeeData)[] = [
  "firstName",
  "lastName",
  "address",
  "dateOfBirth",
  "email",
  "gender",
  "nationality",
  "password",
  "role",
  "departement",
  "phoneNumber",
];
export type Employee = {
  Employee:Prisma.EmployeeGetPayload<{}>
}
export type Employees = {
  Employees:Prisma.EmployeeGetPayload<{select:{id: true,
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
    state: true,}}>[]
}  
