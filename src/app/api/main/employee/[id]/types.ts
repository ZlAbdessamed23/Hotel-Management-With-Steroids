// types.ts
import {
  UserGender,
  UserRole,
  Departements,
  DaysOfWeek,
  EmployeeState,
  
  Prisma,
} from "@prisma/client";





export type UpdateEmployeeData = {
  firstName?: string;
  lastName?: string;
  address?: string;
  dateOfBirth?: Date;
  email?: string;
  phoneNumber?: string;
  gender?: UserGender;
  nationality?: string;
  role?: UserRole[];
  departement?: Departements[];
  workingDays?: DaysOfWeek[];
  state?: EmployeeState;
  isActivated?: boolean;
  password?: string;
};
export type Employee ={
  Employee : Prisma.EmployeeGetPayload<{select:{id: true,
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
    state: true}}>
}