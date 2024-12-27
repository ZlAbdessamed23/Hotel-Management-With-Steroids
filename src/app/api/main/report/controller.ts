import prisma from "@/lib/prisma/prismaClient";
import { AddDocumentData, DocumentResult, DocumentsResult } from "@/app/api/main/report/types";
import {
  LimitExceededError,
  NotFoundError,
  SubscriptionError,
} from "@/lib/error_handler/customerErrors";
import { UserRole } from "@prisma/client";
import { throwAppropriateError } from "@/lib/error_handler/throwError";
import { updateReportStatistics } from "@/app/api/main/statistics/statistics";
export async function addDocument(
  data: AddDocumentData,
  hotelId: string,
  userId: string,
  userRole: UserRole[]
): Promise<DocumentResult> {
  try {
    return await prisma.$transaction(async (prisma) => {
      const isAdmin = userRole.includes(UserRole.admin);

      // Parallel verification of hotel and user
      const [hotel, userData] = await Promise.all([
        prisma.hotel.findUnique({
          where: { id: hotelId },
          select: {
            subscription: {
              select: {
                plan: {
                  select: {
                    maxReports: true,
                  },
                },
              },
            },
            _count: { select: { document: true } },
            admin: {
              select: { id: true },
            },
          },
        }),
        isAdmin 
          ? prisma.admin.findUnique({
              where: { id: userId },
              select: { firstName: true, lastName: true },
            })
          : prisma.employee.findUnique({
              where: { id: userId },
              select: { firstName: true, lastName: true },
            })
      ]);

      // Verify hotel
      if (!hotel) throw new NotFoundError("Hotel non trouvée");
      if (!hotel.subscription?.plan)
        throw new SubscriptionError("Hotel n'a pas d'abonnement actif");
      if (hotel._count.document >= hotel.subscription.plan.maxReports) {
        throw new LimitExceededError(
          "Le nombre Maximum des employées pour ce plan est déja atteint"
        );
      }

      // Verify user
      if (!userData) {
        throw new NotFoundError(
          isAdmin ? "Administrateur non trouvé" : "Employé non trouvé"
        );
      }

      // Create creator string
      const creator = `${userData.firstName} ${userData.lastName} (${isAdmin ? 'Admin' : 'Employé'})`;

      // Filter valid employee access
      const validEmployeeAccess = data.employeeAccess.filter(
        (ea) => ea.employeeId !== ""
      );

      // Create document
      const createdDocument = await prisma.document.create({
        data: {
          title: data.title,
          description: data.description,
          creator,
          hotel: { connect: { id: hotelId } },
          ...(isAdmin
            ? { createdByAdmin: { connect: { id: userId } } }
            : { createdByEmployee: { connect: { id: userId } } }),
          documentAccess: {
            create: [
              { [isAdmin ? "admin" : "employee"]: { connect: { id: userId } } },
              ...(!isAdmin && hotel.admin.id 
                ? [{ admin: { connect: { id: hotel.admin.id } } }] 
                : []),
              ...validEmployeeAccess.map((ea) => ({
                employee: { connect: { id: ea.employeeId } },
              })),
            ],
          },
        },
        select: {
          id: true,
          title: true,
          description: true,
          creator: true,
        },
      });

      await updateReportStatistics(hotelId, "add", prisma);
      return { Document: createdDocument };
    });
  } catch (error) {
    throwAppropriateError(error);
  }
}

export async function getAllDocuments(
  hotelId: string
): Promise<DocumentsResult> {
  try {
    const documents = await prisma.document.findMany({
      where: { hotelId: hotelId },
      select: { id: true, title: true, description: true },
    });

    return { Documents: documents };
  } catch (error) {
    throwAppropriateError(error);
  }
}
