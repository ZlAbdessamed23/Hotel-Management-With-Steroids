import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma/prismaClient";
import { AddNoteData, NoteResult, NotesResult } from "@/app/api/main/note/types";
import {
  ValidationError,
  
  LimitExceededError,
} from "@/lib/error_handler/customerErrors";
import { UserRole } from "@prisma/client";
import { throwAppropriateError } from "@/lib/error_handler/throwError";
import { updateNoteStatistics } from "@/app/api/main/statistics/statistics";

export async function addNote(
  data: AddNoteData,
  hotelId: string,
  userId: string,
  userRole: UserRole[]
): Promise<NoteResult> {
  try {
    return await prisma.$transaction(async (prisma) => {
      const [hotel, noteCount] = await Promise.all([
        prisma.hotel.findUnique({
          where: { id: hotelId },
          include: {
            subscription: {
              include: {
                plan: true,
              },
            },
          },
        }),
        prisma.note.count({
          where: {
            hotelId,
            ...(userRole.includes(UserRole.admin)
              ? { adminId: userId }
              : { employeeId: userId }),
          },
        }),
      ]);

      if (!hotel) throw new ValidationError("Hotel non trouvée");
      if (!hotel.subscription?.plan)
        throw new ValidationError("Hotel n'a pas d'abonnement active");

      const maxNotes = hotel.subscription.plan.maxNotes;
      if (noteCount >= maxNotes) {
        throw new LimitExceededError(
          "Le nombre Maximum des notes pour cet utilisateur pour ce plan est déja atteint"
        );
      }

      const createdNote = await prisma.note.create({
        data: {
          ...data,
          hotelId,
          ...(userRole.includes(UserRole.admin)
            ? { adminId: userId }
            : { employeeId: userId }),
        },
        select : {
          id : true,
          title : true,
          deadline : true,
          createdAt : true,description : true,
          
        }
      });
      await updateNoteStatistics(hotelId, "add", prisma);

      return { Note: createdNote };
    });
  } catch (error) {
    throwAppropriateError(error);
  }
}
////////////////////// get all not for employee ///////////////////
export async function getAllNotes(
  hotelId: string,
  userId: string,
  userRole: UserRole[]
): Promise<NotesResult> {
  try {
    const notes = await prisma.note.findMany({
      where: {
        hotelId: hotelId,
        ...(userRole.includes(UserRole.admin)
          ? { adminId: userId }
          : { employeeId: userId }), // If not admin, get only employee notes
      },
      select : {
        id : true,
        title : true,
        deadline : true,
        createdAt : true,
        description : true,
        
      },
      orderBy: {
        createdAt: "desc", // Order by creation date, newest first
      },
    });

    return { notes };
  } catch (error) {
    throwAppropriateError(error);
  }
}
