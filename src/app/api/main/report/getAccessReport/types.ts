import { Prisma } from "@prisma/client";
export type DocumentsResult = {
  Documents: Prisma.DocumentGetPayload<{
    select: { id: true; title: true; description: true };
  }>[];
};
