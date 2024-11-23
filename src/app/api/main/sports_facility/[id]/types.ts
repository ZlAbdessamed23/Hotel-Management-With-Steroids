import { DaysOfWeek, Prisma, SportsFacilityType } from "@prisma/client";

export type UpdateSportsFacilityData = {
  name?: string;
  description?: string;
  capacity?: number;
  price?: number | string;
  openingDays?: DaysOfWeek[];
  type?: SportsFacilityType;
  location?: string;
  sportsFacilityCoaches?: {
    employeeId: string;
  }[];
};
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
