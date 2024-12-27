import { Prisma } from "@prisma/client";

export type AddNoteData = {
  title: string;
  description?: string;
  deadline: Date;
  
};

export const requiredNoteFields: (keyof AddNoteData)[] = [
  "title",
  
  "deadline",
];

export type NoteResult = {
  Note: Prisma.NoteGetPayload<{select : {
    id : true,
    title : true,
    deadline : true,
    createdAt : true,description : true,

  }}>;
};

export type NotesResult = {
  notes: Prisma.NoteGetPayload<{select : {
    id : true,
    title : true,
    deadline : true,
    createdAt : true,description : true,
    
  }}>[];
};
