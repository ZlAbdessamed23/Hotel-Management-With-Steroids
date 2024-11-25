import { Prisma } from "@prisma/client";
export type CafeteriasResult = {
  Cafeterias: Prisma.CafeteriaGetPayload<{
    select: { id: true; name: true; description: true };
  }>[];
};
