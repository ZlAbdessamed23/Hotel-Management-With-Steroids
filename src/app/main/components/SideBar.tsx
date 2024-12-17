"use client"

import { SidebarItemType } from '@/app/types/types'
import Link from 'next/link'
import React from 'react'
import { FaHome, FaBed, FaCalendarAlt, FaTimes, FaHistory } from "react-icons/fa"
import { IoStatsChart, IoCafe } from "react-icons/io5"
import { ImSpoonKnife } from "react-icons/im"
import { FaRegNewspaper, FaUserGroup , FaUserClock } from "react-icons/fa6"
import { MdOutlineWatchLater, MdAreaChart, MdOutlineSportsTennis , MdCleaningServices } from "react-icons/md"
import { GrTask, GrRestaurant } from "react-icons/gr"
import { CgNotes } from "react-icons/cg"
import { TiGroup } from "react-icons/ti"
import { TfiStatsUp } from "react-icons/tfi";
import Image from 'next/image'
import DocumentsImage from "/public/documents.svg"
import { Button } from '@nextui-org/react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useSidebar } from './SidebarContext'


function sideBarItem(itemInfos: SidebarItemType, path: string): React.ReactElement {
    return (<Link key={itemInfos.title} href={itemInfos.url} className={`flex flex-row items-center gap-4 px-6 py-3 w-full sm:py-2 sm:px-1 sm:w-10 lg:py-3 lg:px-6 lg:w-full rounded-md hover:bg-primary-100 ${path === itemInfos.url ? "bg-blue-400" : ""}`}>
        <itemInfos.icon className='size-7 p-1 rounded-md text-black bg-primary-100 dark:text-white dark:bg-slate-800' />
        <p className='sm:hidden lg:block'>{itemInfos.title}</p>
    </Link>)
}

const sideBarLinks: Array<SidebarItemType> = [
    {
        icon: FaHome,
        title: "Maison",
        url: "/main",
    },
    {
        icon: IoStatsChart,
        title: "Statistiques",
        url: "/main/admin/statistics",
    },
    {
        icon: MdAreaChart,
        title: "Tbleaux de Bord",
        url: "/main/admin/dashboard",
    },
    {
        icon: TiGroup,
        title: "Employées",
        url: "/main/admin/manageemployees",
    },
    {
        icon: GrTask,
        title: "Taches",
        url: "/main/manager/managetasks",
    },
    {
        icon: FaHistory,
        title: "Historique des Clients",
        url: "/main/admin/history",
    },
    {
        icon: TfiStatsUp,
        title: "Stock Centrale",
        url: "/main/employee/managestock",
    },
];

const sideBarLinks2: Array<SidebarItemType> = [

    {
        icon: FaUserGroup,
        title: "Clients",
        url: "/main/employee/reception/manageclients",
    },
    {
        icon: FaUserClock,
        title: "Clients en Attente",
        url: "/main/employee/reception/manageclients/waitinglist",
    },
    {
        icon: FaBed,
        title: "Chambres",
        url: "/main/employee/reception/managerooms",
    },
    {
        icon: MdCleaningServices,
        title: "Entretien Ménager",
        url: "/main/employee/housekeeping",
    },
    {
        icon: ImSpoonKnife,
        title: "Restaurant",
        url: "/main/employee/restauration/customrestaurant",
    },
    {
        icon: IoCafe,
        title: "Cafeteria",
        url: "/main/employee/restauration/customcafeteria",
    },
    {
        icon: GrRestaurant,
        title: "stock personnalisé",
        url: "/main/employee/managestock/customstock",
    },
    {
        icon: CgNotes,
        title: "Notes",
        url: "/main/managenotes",
    },
    {
        icon: FaRegNewspaper,
        title: "Rapports",
        url: "/main/managereports",
    },
    {
        icon: MdOutlineSportsTennis,
        title: "Salle de Sport",
        url: "/main/employee/reception/managegyms",
    },
    {
        icon: MdOutlineWatchLater,
        title: "Evenements",
        url: "/main/employee/reception/manageevents",
    },
    {
        icon: FaCalendarAlt,
        title: "Calendrier",
        url: "/main/hoteleventsschedular",
    },
];

export default function SideBar() {
    const path = usePathname()
    const { isOpen, toggleSidebar } = useSidebar();

    const sidebarVariants = {
        open: {
            x: 0,
            width: "auto",
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 40,
                mass: 1,
            }
        },
        closed: {
            x: "-100%",
            width: 0,
            opacity: 0,
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 40,
                mass: 1,
            }
        }
    };


    const overlayVariants = {
        open: {
            opacity: 1,
            display: "block"
        },
        closed: {
            opacity: 0,
            transitionEnd: {
                display: "none"
            },
        },
    };

    return (
        <>
            <div className='hidden sm:block font-sans pl-0 pr-2 lg:px-2 sm:relative absolute top-0 z-50'>
                <div className='py-4 px-6 w-[250px] sm:py-1 sm:px-1 sm:w-fit lg:py-4 lg:px-6 bg-white dark:bg-slate-800 rounded-lg lg:w-[300px] zl:w-[331px]'>
                    <h1 className='sm:hidden lg:block text-center text-xl font-semibold text-black mb-4 dark:text-white'>HotyVerse</h1>
                    <div className='gradient-line sm:hidden lg:gradient-line'></div>
                    <section className='flex flex-col gap-1 mb-4 font-semibold'>
                        {sideBarLinks.map((elem) => sideBarItem(elem, path))}
                    </section>
                    <h2 className='sm:hidden lg:block mb-4 pl-0 font-bold'>Organisation</h2>
                    <section className='flex flex-col gap-1 font-semibold mb-4'>
                        {sideBarLinks2.map((elem) => sideBarItem(elem, path))}
                    </section>
                    <div className='sm:hidden lg:block pt-10'>
                        <section className='flex flex-col items-center justify-center mb-8'>
                            <Image src={DocumentsImage} alt='documents image' width={200} height={200} />
                            <p className='text-center mb-2 font-semibold'>Besoin d&apos;aide?</p>
                            <p className='text-center'>Veuillez vérifier notre documentation</p>
                        </section>
                        <section className='flex flex-col items-center justify-center gap-4'>
                            <Link href=""><Button variant='solid' color='primary'>Documentation</Button></Link>
                            <Link href=""><Button variant='solid' color='secondary'>Contactez-nous</Button></Link>
                        </section>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial="closed"
                            animate="open"
                            exit="closed"
                            variants={overlayVariants}
                            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40 sm:hidden"
                            onClick={toggleSidebar}
                        />

                        <motion.div
                            initial="closed"
                            animate="open"
                            exit="closed"
                            variants={sidebarVariants}
                            className="block sm:hidden fixed left-0 top-0 h-full w-[280px] bg-white dark:bg-slate-800 z-50 overflow-y-auto"
                        >
                            <div className='py-4 px-6 w-full'>
                                <div className='flex items-center justify-between py-4 px-6 w-full'>
                                    <h1 className='text-xl font-semibold text-black dark:text-white'>HotyVerse</h1>
                                    <button onClick={toggleSidebar} className="text-2xl text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100">
                                        <FaTimes className='size-6' />
                                    </button>
                                </div>                                <div className='gradient-line'></div>
                                <section className='flex flex-col gap-1 mb-4 font-semibold'>
                                    {sideBarLinks.map((elem) => sideBarItem(elem, path))}
                                </section>
                                <h2 className='mb-4 pl-[10%] font-bold'>Organisation</h2>
                                <section className='flex flex-col gap-1 font-semibold mb-4'>
                                    {sideBarLinks2.map((elem) => sideBarItem(elem, path))}
                                </section>
                                <div className='pt-10'>
                                    <section className='flex flex-col items-center justify-center mb-8'>
                                        <Image src={DocumentsImage} alt='documents image' width={200} height={200} />
                                        <p className='text-center mb-2 font-semibold'>Besoin d&apos;aide?</p>
                                        <p className='text-center'>Veuillez vérifier notre documentation</p>
                                    </section>
                                    <section className='flex flex-col items-center justify-center gap-4'>
                                        <Link href=""><Button variant='solid' color='primary'>Documentation</Button></Link>
                                        <Link href=""><Button variant='solid' color='secondary'>Contactez-nous</Button></Link>
                                    </section>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    )
}