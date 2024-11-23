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
  CafeteriaMenu: Prisma.CafeteriaMenuGetPayload<{
    select : {
      id : true,
      endTime : true,
      startTime : true,
      name : true,
      createdAt : true,
      cafeteriaId : true,
      description : true,

    }
  }>;
};

export type CafeteriaMenusResult = {
  CafeteriaMenus: Prisma.CafeteriaMenuGetPayload<{select : {
      id : true,
      endTime : true,
      startTime : true,
      name : true,
      createdAt : true,
      cafeteriaId : true,
      description : true,
      
    }}>[];
};
