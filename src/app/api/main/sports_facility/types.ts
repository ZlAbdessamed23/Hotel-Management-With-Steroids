import { DaysOfWeek, Prisma, SportsFacilityType } from "@prisma/client";

export type AddSportsFacilityData = {
  name: string;
  description: string;
  capacity: number;
  price?: number | string;
  openingDays?: DaysOfWeek[];
  type: SportsFacilityType;
  location?: string;
  sportsFacilityCoaches?: {
    employeeId: string;
  }[];
};

export const requiredSportsFacilityFields: (keyof AddSportsFacilityData)[] = [
  "name",
  "description",
  "capacity",
  
  "type",
];

export type SportsFacilityResult = {
  sportsFacility: Prisma.SportsFacilityGetPayload<{}>;
};

export type SportsFacilitiesResult = {
  sportsFacilities: Prisma.SportsFacilityGetPayload<{}>[];
};
