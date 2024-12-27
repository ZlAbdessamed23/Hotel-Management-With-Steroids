import { Prisma } from "@prisma/client";

export type AddCafeteriaData = {
  name: string;
  description?: string;
  location?: string;

  cafeteriaEmployee: {
    employeeId: string;
  }[];
};

export const requiredCafeteriaFields: (keyof AddCafeteriaData)[] = [
  "name",

  "cafeteriaEmployee",
];

export type CafeteriaResult = {
  Cafeteria: Prisma.CafeteriaGetPayload<{select: { id: true; name: true; description: true , createdAt : true }}>;
};

export type CafeteriasResult = {
  Cafeterias: Prisma.CafeteriaGetPayload<{
    select: { id: true; name: true; description: true , createdAt : true };
  }>[];
};
