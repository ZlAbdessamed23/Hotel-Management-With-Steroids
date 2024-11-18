import { Prisma } from "@prisma/client";
export type SportFacilityCoaches = {
  coaches: Prisma.SportsFacilityCoachGetPayload<{
    include: {
      employee: {
        select: {
          id: true;
          firstName: true;
          lastName: true;
          email: true;
          phoneNumber: true;
          gender: true;
          workingDays: true;
          state: true;
        };
      };
    };
  }>[];
  SportFacilityCoachesCount : number
};

export type UpdateSportsFacilityCoachesData = {
  sportsFacilityCoaches?: {
    employeeId: string;
  }[];
};

export type SportsFacilityCoachesResult = {
  SportsFacility: Prisma.SportsFacilityGetPayload<{
    include: {
      sportFacilityCoaches: {
        include: {
          employee: true;
        };
      };
    };
  }> | null;
  
};
