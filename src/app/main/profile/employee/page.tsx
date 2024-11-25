import React from 'react'
import { RegisteredEmployee} from '@/app/types/types'
import TaskNoteSection from '../components/TaskNoteSection'
import EmployeeDetails from '../components/EmployeeDetails'
import { getCurrentEmployeeInfos} from '@/app/utils/funcs'
import { headers } from 'next/headers'

export default async function EmployeeProfile() {
  const headersList = headers();
  const token = headersList.get('cookie') || '';
  const employee = (await getCurrentEmployeeInfos(token)).Employee;
  const {note , employeeTask , ...user} = employee;
  const tasks = employeeTask?.map((task) => task.task);

  
  return (
    <div className='flex flex-col gap-12'>
      <EmployeeDetails infos={user as RegisteredEmployee} />
      <TaskNoteSection title={'Taches'} data={tasks || []} />
      <TaskNoteSection title={'Notes'} data={note} />
    </div>
  )
}
