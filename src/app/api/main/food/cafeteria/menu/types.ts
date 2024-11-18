import { Prisma } from "@prisma/client";

export type AddCafeteriaMenuData = {
  name: string;
  description: string;
  startTime: string;
  endTime: string;
  cafeteriaId :string
};

export const requiredCafeteriaMenuFields: (keyof AddCafeteriaMenuData)[] = [
  "name",
  "description",
  "startTime",
  "endTime",
  "cafeteriaId",
];

export type CafeteriaMenuResult = {
  CafeteriaMenu: Prisma.CafeteriaMenuGetPayload<{}>;
};

export type CafeteriaMenusResult = {
  CafeteriaMenus: Prisma.CafeteriaMenuGetPayload<{}>[];
};
