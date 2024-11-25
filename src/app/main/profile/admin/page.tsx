import React from 'react'
import TaskNoteSection from '../components/TaskNoteSection'
import AdminDetails from '../components/AdminDetails'
import { Note,Task } from '@/app/types/types';
import { headers } from 'next/headers';
import { getTasks, getNotes, getAdminHotelInfos } from '@/app/utils/funcs';
import HotelDetails from '../components/HotelDetails';

export default async function AdminProfile() {

  const headersList = headers();
  const token = headersList.get('cookie') || '';

  const tasks: { Tasks: Array<Task> } = await getTasks(token);
  const notes: { notes: Array<Note> } = await getNotes(token);
  const infos = await getAdminHotelInfos(token);
  const { hotel, ...admin } = infos.Admin;


  return (
    <div className='flex flex-col gap-12 w-full overflow-x-hidden'>
      <AdminDetails infos={admin} />
      <HotelDetails infos={hotel} />
      <TaskNoteSection title={'Taches'} data={tasks.Tasks} />
      <TaskNoteSection title={'Notes'} data={notes.notes} />
    </div>
  )
}
