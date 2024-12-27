import {
  NotFoundError,
  UnauthorizedError,
} from "@/lib/error_handler/customerErrors";
import { throwAppropriateError } from "@/lib/error_handler/throwError";
import { Prisma, UserRole } from "@prisma/client";
import prisma from "@/lib/prisma/prismaClient";
import { DocumentResult, AddDocumentData } from "@/app/api/main/report/[id]/types";
import { updateReportStatistics } from "@/app/api/main/statistics/statistics";

export async function updateDocument(
  documentId: string,
  
  data: AddDocumentData
): Promise<{ Document: any }> {
  try {
    return await prisma.$transaction(async (prisma) => {
      const updateData: Prisma.DocumentUpdateInput = {};

      if (data.title !== undefined) updateData.title = data.title;
      if (data.description !== undefined)
        updateData.description = data.description;
      if (data.content !== undefined) updateData.content = data.content;

      if (Array.isArray(data.employeeAccess)) {
        const newEmployeeIds = data.employeeAccess
          .filter(ea => ea.employeeId !== "") // Filter out empty employee IDs
          .map(ea => ea.employeeId);

        updateData.documentAccess = {
          deleteMany: {
            AND: [{ documentId }, { employeeId: { not: null } }],
          },

          ...(newEmployeeIds.length > 0 && {
            create: newEmployeeIds.map((employeeId) => ({
              employee: { connect: { id: employeeId } },
            })),
          }),
        };
      }
          
      if (Object.keys(updateData).length > 0) {
        const updatedDocument = await prisma.document.update({
          where: { id: documentId },
          data: updateData,
        });
        
      
        return { Document: updatedDocument };
      }

      const existingDocument = await prisma.document.findUnique({
        where: { id: documentId },
      });
      return { Document: existingDocument };
    });
  } catch (error) {
    throw throwAppropriateError(error);
  }
}

export async function getDocumentById(
  documentId: string,
  hotelId: string,
  userId: string,
  userRole: UserRole[]
): Promise<DocumentResult> {
  try {
    const existingDocument = await prisma.document.findUnique({
      where: { id: documentId },
      include: {
        hotel: true,
        documentAccess: {
          include: {
            admin: true,
            employee: true,
          },
        },
      },
    });

    if (!existingDocument || existingDocument.hotel.id !== hotelId) {
      throw new NotFoundError(`Document non trouvée`);
    }

    const hasAccess = existingDocument.documentAccess.some(
      (access) =>
        (access.admin && access.admin.id === userId) ||
        (access.employee && access.employee.id === userId)
    );

    if (!hasAccess && !userRole.includes(UserRole.admin)) {
      throw new UnauthorizedError(
        "Vous n'êtes pas autorisé à consulter ce document"
      );
    }
    
    return { Document: existingDocument };
  } catch (error) {
    throw throwAppropriateError(error);
  }
}

export async function deleteDocument(
  documentId: string,
  hotelId: string,
  userId: string,
  userRole: UserRole[]
): Promise<{ Document: any }> {
  try {
    return await prisma.$transaction(async (prisma) => {
      const existingDocument = await prisma.document.findUnique({
        where: { id: documentId },
        include: {
          hotel: true,
          createdByEmployee: true,
          createdByAdmin: true,
        },
      });

      if (!existingDocument || existingDocument.hotel.id !== hotelId) {
        throw new NotFoundError(`Document non trouvée`);
      }

      const isCreator =
        existingDocument.createdByEmployeeId === userId ||
        existingDocument.createdByAdminId === userId;
      
      const isAdmin = userRole.includes(UserRole.admin);

      // Allow deletion if user is either the creator OR an admin
      if (!isCreator && !isAdmin) {
        throw new UnauthorizedError(
          "Vous n'êtes pas autorisé à supprimer ce document. Seul le créateur ou un administrateur peut le supprimer"
        );
      }

      const deletedDocument = await prisma.document.delete({
        where: { id: documentId },
      });
      await updateReportStatistics(hotelId, "remove", prisma);
      return { Document: deletedDocument };
    });
  } catch (error) {
    throw throwAppropriateError(error);
  }
}
