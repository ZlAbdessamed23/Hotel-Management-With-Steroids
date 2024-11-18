import { Prisma } from "@prisma/client";

export type UpdateCalendarData = {
  title?: string;
  description?: string;

  start?: string;
  end?: string;
};

export type CalendarResult = {
  Calendar: Prisma.CalendarGetPayload<{}>;
};
