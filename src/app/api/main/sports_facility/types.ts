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
  sportsFacility: Prisma.SportsFacilityGetPayload<{select : {
    id : true,
    capacity : true,
    createdAt : true,
    description : true,
    location : true,
     name : true,
     price : true,
     openingDays : true,
     type : true,

  }}>;
};

export type SportsFacilitiesResult = {
  sportsFacilities: Prisma.SportsFacilityGetPayload<{select : {
    id : true,
    capacity : true,
    createdAt : true,
    description : true,
    location : true,
     name : true,
     price : true,
     openingDays : true,
     type : true,
     
  }}>[];
};
