import { SecondCardItemType } from '@/app/types/types'
import React from 'react'
import Image from 'next/image'
import { CircularProgress } from '@nextui-org/react'




export default function CardStyle2({infos} : {infos : SecondCardItemType}) {
  return (
    <div className='w-72 h-56 md:h-full flex flex-col gap-3 py-6 px-4 rounded-xl font-sans bg-white dark:bg-slate-800'>
        <section className='flex justify-between items-center'>
            <p className='text-xl font-bold text-primary-500 '>{infos.title}</p>
            {
                typeof infos.icon === "function" ? <infos.icon className='size-9 p-1 rounded-md bg-primary-100'/>
                : <Image src={infos.icon} alt='' height={36} width={36} className='p-1 rounded-md bg-primary-100'/>
            }
        </section>
        <section className='w-full'>
            <p className='text-center text-lg font-medium mb-2 pl-1 dark:text-white'>{infos.currentValue} {infos.subject}</p>
        </section>
        <section className='flex justify-between items-center'>
        <CircularProgress
            aria-label="Loading..."
            size="lg"
            value={infos.pourcentage}
            color="primary"
            showValueLabel={true}
            classNames={{
                value : "text-lg font-bold dark:text-white",
                svg : "h-16 w-16"
            }}
        />
        <span className='flex flex-col items-center'>
            <p className='text-green-600 font-semibold text-lg'>{infos.exiting}</p>
            <p className='font-medium dark:text-white'>{infos.sentence}</p>
        </span>
        </section>
    </div>
  )
}
