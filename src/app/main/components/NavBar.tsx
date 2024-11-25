"use client"

import React, { useEffect, useState } from 'react'
import { IoPersonOutline } from "react-icons/io5";
import { IoMdNotificationsOutline } from "react-icons/io";
import { FaMoon, FaSun } from "react-icons/fa";
import { Button } from '@nextui-org/react';
import { useTheme } from 'next-themes';
import { usePathname, useRouter } from 'next/navigation';
import { useSidebar } from './SidebarContext';
import { IoMenu } from "react-icons/io5";


function TranslateRoutesKeysFromEngToFr(key: string): string {
  switch (key) {
    case "Employees": return "Employées";
    case "Rooms": return "Chambres";
    case "Event": return "Evenements";
    case "Salles": return "Salles du sport";
    case "Statistics": return "Statistiques";
    case "Dashboard": return "Tableau de bord";
    case "Hoteleventsschedular": return "Calendrier";
    case "Stock": return "Stock Centrale";
    case "Reports": return "Rapports";
    case "Material": return "Materiel";
    case "Tasks": return "Taches";
    default: return key;
  };
};

export default function NavBar() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState<boolean>(false);
  const { isOpen, toggleSidebar } = useSidebar();

  function getFormattedLastPathSegment(path: string): string {
    const trimmedPath = path.endsWith('/') ? path.slice(0, -1) : path;
    const segments = trimmedPath.split('/');
    let lastSegment = segments[segments.length - 1];

    if (lastSegment.toLowerCase().startsWith('manage')) {
      lastSegment = lastSegment.slice(6);
    };

    return lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1);
  };

  function redirectToAccountPage() {
    router.push("/main/profile");
  };

  const path = usePathname();

  const pathname = getFormattedLastPathSegment(path);

  const handleOpenSidebar = () => {
    if (!isOpen) {
      toggleSidebar();
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div>Loading ...</div>

  return (
    <div className='lg:w-full flex justify-between items-center'>
      <Button
        className='bg-transparent sm:hidden'
        isIconOnly={true}
        onClick={handleOpenSidebar}
      ><IoMenu className='size-8 block sm:hidden'/></Button>
      <section className='font-sans font-normal p-1 text-start  lg:font-semibold lg:w-fit lg:p-2 lg:text-center'>
        <p>Pages/{TranslateRoutesKeysFromEngToFr(pathname)}</p>
        <p className='text-base lg:text-lg'>{TranslateRoutesKeysFromEngToFr(pathname)}</p>
      </section>
      <section className='flex flex-row items-center gap-4'>
        <Button className='bg-transparent' isIconOnly={true} onClick={() => redirectToAccountPage()}><IoPersonOutline className='size-7 cursor-pointer' /></Button>
        {/* <Button className='bg-transparent' isIconOnly={true}><IoMdNotificationsOutline className='size-7 cursor-pointer' /></Button> */}
        <Button className='bg-transparent' isIconOnly={true} onClick={() => setTheme(theme === "light" ? "dark" : "light")}>{theme === "light" ? <FaMoon className='size-6' /> : <FaSun className='size-6' />}</Button>
      </section>
    </div>
  )
}
