import { Prisma } from "@prisma/client";

export type AddDocumentData = {
  title?: string;
  description?: string;
  content?: string;
  employeeAccess?: {
    employeeId: string;
  }[];
};

export type DocumentResult = {
  Document: Prisma.DocumentGetPayload<{}> | null;
};
