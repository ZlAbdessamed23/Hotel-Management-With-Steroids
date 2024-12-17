import React from 'react'
import SideBar from './components/SideBar'
import NavBar from './components/NavBar'
import { SidebarProvider } from '@/app/main/components/SidebarContext'

export default function Layout({children}: {children: React.ReactNode}) {
  return (
    <SidebarProvider>
      <div className='main-layout-container w-screen min-h-screen px-1 xl:px-4 pb-4 pt-6 flex flex-row font-sans bg-slate-300 dark:bg-gray-900'>
        <SideBar />
        <div className='flex flex-col gap-4 px-2 w-full overflow-hidden'>
          <NavBar />
          {children}
        </div>
      </div>
    </SidebarProvider>
  )
}