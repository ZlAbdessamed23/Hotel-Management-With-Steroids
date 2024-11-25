import { Prisma } from "@prisma/client";

export type SportFacilityCoach = {
  coach: Prisma.SportsFacilityCoachGetPayload<{
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
          role: true;
        };
      };
    };
  }>;
};
