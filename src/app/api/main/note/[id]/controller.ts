import {
  NotFoundError,
  UnauthorizedError,
} from "@/lib/error_handler/customerErrors";
import { NoteResult, UpdateNoteData } from "./types";
import prisma from "@/lib/prisma/prismaClient";
import { Prisma, UserRole } from "@prisma/client";
import { throwAppropriateError } from "@/lib/error_handler/throwError";
import { updateNoteStatistics } from "@/app/api/main/statistics/statistics";
/////////////////////////// get note //////////////////////////////
export async function getNoteById(
  noteId: string,
  userId: string,
  userRole: UserRole[],
  hotelId: string
): Promise<NoteResult> {
  try {
    const note = await prisma.note.findUnique({
      where: { id: noteId,...(userRole.includes(UserRole.admin)
        ? { adminId: userId }
        : { employeeId: userId }), },
        select : {
          id : true,
          title : true,
          deadline : true,
          createdAt : true,description : true,
          
        }
    });

    if (!note ) {
      throw new NotFoundError(
        `Note n'est pas trouvée`
      );
    }

    

    return { note };
  } catch (error) {
    throw throwAppropriateError(error);
  }
}
/////////////////////////// delete note /////////////////////////////////////
export async function deleteNote(
  noteId: string,
  userId: string,
  userRole: UserRole[],
  hotelId: string
): Promise<NoteResult> {
  try {
    return await prisma.$transaction(async (prisma) => {
      

      const deletedNote = await prisma.note.delete({
        where: { id: noteId,...(userRole.includes(UserRole.admin)
          ? { adminId: userId }
          : { employeeId: userId }), },
          select : {
            id : true,
            title : true,
            deadline : true,
            createdAt : true,description : true,
            
          }
      });
      await updateNoteStatistics(hotelId, "remove", prisma);
      return { note: deletedNote };
    });
  } catch (error) {
    throw throwAppropriateError(error);
  }
}
///////////////////////////////// update note ///////////////////////
export async function updateNote(
  noteId: string,
  userId: string,
  userRole: UserRole[],
  hotelId: string,
  data: UpdateNoteData
): Promise<NoteResult> {
  try {
    return await prisma.$transaction(async (prisma) => {
      

      const updateData: Prisma.NoteUpdateInput = {
        title: data.title,
        description: data.description,
        deadline: data.deadline,
        
      };

      // Remove undefined fields
      Object.keys(updateData).forEach((key) => {
        if (
          key in updateData &&
          updateData[key as keyof Prisma.NoteUpdateInput] === undefined
        ) {
          delete updateData[key as keyof Prisma.NoteUpdateInput];
        }
      });

      const updatedNote = await prisma.note.update({
        where: { id: noteId,...(userRole.includes(UserRole.admin)
          ? { adminId: userId }
          : { employeeId: userId }), },
        data: updateData,
        select : {
          id : true,
          title : true,
          deadline : true,
          createdAt : true,description : true,
          
        }
      });

      return { note: updatedNote };
    });
  } catch (error) {
    throw throwAppropriateError(error);
  }
}
