import { DashboardCardType } from '@/app/types/types'
import React from 'react'
import Image from 'next/image'
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import Link from 'next/link';



export default function DashboardCard({infos , bgColor} : {infos : DashboardCardType , bgColor : string}) {
  return (
    <div className='bg-white rounded-xl shadow-sm p-4 w-64 h-40 font-sans dark:bg-slate-800'>
        <section className='flex items-center gap-4 mb-8'>
            <div>
                {
                    typeof infos.icon === "function" ? <infos.icon className={`size-10 p-1  text-white rounded-full ${bgColor}`}/>
                    : <Image src={infos.icon} alt='' height={36} width={36} className={` p-1 text-white rounded-full ${bgColor}`}/>
                }
            </div>
            <div>
                <p className='text-base font-semibold text-gray-400 text-opacity-95 mb-2'>{infos.title}</p>
                <p className='text-lg font-medium flex items-center gap-2 dark:text-white'><span className='text-xl font-semibold'>{infos.value}</span>{infos.subject}</p>
            </div>
        </section>
        <section className='flex items-center justify-between'>
            <Link href={infos.url}>
            <p className="flex items-center text-primary transition-all group cursor-pointer">
                <span>voire tout</span>
                <MdOutlineKeyboardArrowRight className="size-7 transition-transform duration-300 group-hover:translate-x-1" />
            </p>
            </Link>
       
        <p className='text-success-600 bg-[#2AA31F] bg-opacity-50 p-1 rounded-full'>{infos.additionalInfo}</p>
        </section>
    </div>
  )
}
