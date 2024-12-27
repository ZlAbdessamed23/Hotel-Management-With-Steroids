import { NotFoundError } from "@/lib/error_handler/customerErrors";
import { throwAppropriateError } from "@/lib/error_handler/throwError";
import { UserRole, Prisma } from "@prisma/client";
import prisma from "@/lib/prisma/prismaClient";
import { DocumentsResult } from "@/app/api/main/report/getAccessReport/types";

export async function getAccessDocuments(
  userId: string,
  hotelId: string,
  userRole: UserRole[]
): Promise<DocumentsResult> {
  try {
    return await prisma.$transaction(async (prisma) => {
      const documents = await prisma.document.findMany({
        where: {
          hotel: { id: hotelId },
          documentAccess: {
            some: {
              OR: [{ employee: { id: userId } }, { admin: { id: userId } }],
            },
          },
        },
        select: { id: true, title: true, description: true },
      });

      return { Documents: documents };
    });
  } catch (error) {
    throw throwAppropriateError(error);
  }
}
