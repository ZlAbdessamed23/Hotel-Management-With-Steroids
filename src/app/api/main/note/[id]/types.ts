import {  Prisma } from "@prisma/client";
export type UpdateNoteData = {
  title?: string;
  description?: string;
  deadline?: Date;
  
};

export type NoteResult = {
  note: Prisma.NoteGetPayload<{}>;
};
