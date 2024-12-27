import { SeventhCardItemType } from '@/app/types/types'
import React from 'react'
import Image, { StaticImageData } from 'next/image'
import Link from 'next/link'
import { IconType } from 'react-icons'


export default function CardStyle8({infos , url , Icon} : {infos : SeventhCardItemType , url : string , Icon : StaticImageData | IconType}) {

  return (
    <Link href={`${url}/${infos.id}`}>
      <div className='p-4 pr-6 grid grid-cols-[80%,20%] gap-4 items-center rounded-lg font-sans bg-white dark:bg-slate-800'>
      <section className='flex flex-col gap-1 justify-between w-11/12'>
          <p className='text-xl font-bold text-primary-500'>{infos.title}</p>
          <p className='text-medium font-medium text-black dark:text-white ml-3 h-12 w-full text-ellipsis overflow-hidden'>{infos.description}</p>
          <p className='text-sm font-light text-secondary-500'>{new Date(infos.date).toISOString().split('T')[0]}</p>
      </section>
      <section>
          {
            typeof Icon === "function" ? <Icon className='h-full w-full p-1 rounded-md text-black bg-primary-100'/>
            : <Image src={Icon} alt='' className='p-1 w-full rounded-md text-black'/>
          }
      </section>
    </div>
    </Link>
  )
};
