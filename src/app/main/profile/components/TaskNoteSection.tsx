"use client"

import React, { useState } from 'react'
import CardStyle4 from '../../components/cards/CardStyle4'
import { Note, Task } from '@/app/types/types'
import NoteImage from "/public/NoteImage.svg";
import TaskImage from "/public/TaskImage.svg";
import { useDisclosure } from '@nextui-org/react';
import TaskNoteDisplayModal from '../../components/modals/display/NoteTaskDisplayModal';

export default function TaskNoteSection({ title, data = [] }: { title: string, data: Array<Note> | Array<Task> }) {

  const DisplayModal = useDisclosure();
  const [displayedItem, setDisplayedItem] = useState<Note | Task>({
    id: "",
    title: "",
    description: "",
    deadline: new Date().toISOString(),
    isDone: false,
  });
  return (
    <div className='px-4 py-6 rounded-xl bg-white shadow-sm font-sans flex flex-col gap-8 dark dark:bg-slate-800 dark:text-white'>
      <section className='flex items-center justify-between'>
        <span className='flex items-center gap-4'>
          <p className='h-14 w-3 rounded-full bg-green-400'></p>
          <p className='text-3xl font-semibold'>{title}</p>
        </span>
      </section>
      <TaskNoteDisplayModal data1={displayedItem} props={DisplayModal} />
      <div>
        {
          title === "Notes" ? <section className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'>
            {
              data.map((item) => (<CardStyle4 key={item.id} DipslayIcon={NoteImage} infos={item} onOpen={DisplayModal.onOpen} setDisplayedItem={setDisplayedItem} />))
            }
          </section> : <section className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'>
            {
              data.length > 0 && data.map((item) => (<CardStyle4 key={item.id} DipslayIcon={TaskImage} infos={item} onOpen={DisplayModal.onOpen} setDisplayedItem={setDisplayedItem} />))
            }
          </section>
        }
      </div>
    </div>
  )
}
