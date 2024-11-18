import { Prisma } from "@prisma/client";

export type AddCalendarData = {
  title: string;
  description?: string;
  start: string;
  end: string;
};

export const requiredCalendarFields: (keyof AddCalendarData)[] = [
  "title",
  "start",
  "end",
];

export type CalendarResult = {
  Calendar: Prisma.CalendarGetPayload<{}>;
};

export type CalendarsResult = {
  Calendars: Prisma.CalendarGetPayload<{}>[];
};
