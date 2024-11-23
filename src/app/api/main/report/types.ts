import { Prisma } from "@prisma/client";

export type AddDocumentData = {
  title: string;
  description?: string;

  employeeAccess: {
    employeeId: string;
  }[];
};

export const requiredDocumentFields: (keyof AddDocumentData)[] = [
  "title",

  "employeeAccess",
];

export type DocumentResult = {
  Document: Prisma.DocumentGetPayload<{select: { id: true; title: true; description: true };}>;
};

export type DocumentsResult = {
  Documents: Prisma.DocumentGetPayload<{
    select: { id: true; title: true; description: true };
  }>[];
};
