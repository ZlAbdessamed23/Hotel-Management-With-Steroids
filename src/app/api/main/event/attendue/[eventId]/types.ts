import { Prisma } from "@prisma/client";

export type EventAttendeeResult = {
  Attendues: Prisma.AttendueGetPayload<{}>[];
};
