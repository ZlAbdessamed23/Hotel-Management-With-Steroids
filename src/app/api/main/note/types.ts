import { Prisma } from "@prisma/client";

export type AddNoteData = {
  title: string;
  description: string;
  deadline: Date;
  
};

export const requiredNoteFields: (keyof AddNoteData)[] = [
  "title",
  "description",
  "deadline",
];

export type NoteResult = {
  Note: Prisma.NoteGetPayload<{}>;
};

export type NotesResult = {
  notes: Prisma.NoteGetPayload<{}>[];
};
