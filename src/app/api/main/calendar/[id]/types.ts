import { Prisma } from "@prisma/client";

export type UpdateCalendarData = {
  title?: string;
  description?: string;

  start?: string;
  end?: string;
};

export type CalendarResult = {
  Calendar: Prisma.CalendarGetPayload<{select:{
    id : true,
    end: true,
    description:true,
    start:true,
    title : true,
    createdAt : true
  }}>;
};
