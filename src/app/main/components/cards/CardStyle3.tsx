import { ThirdCardItemType } from '@/app/types/types'
import React from 'react'
import Image from 'next/image'
import { CircularProgress } from '@nextui-org/react'


export default function CardStyle3({infos} : {infos : ThirdCardItemType}) {
  return (
    <div className='py-6 px-4 grid grid-cols-[80%,20%] rounded-lg font-sans bg-white w-[20rem] dark:bg-slate-800'>
        <section className='flex flex-col items-start'>
            <p className='text-xl font-bold text-secondary-500'>{infos.title}</p>
            <p className='text-lg font-medium mb-2 pl-1 text-black dark:text-white'>{infos.currentValue} {infos.subject}</p>
            <div className='flex flex-row items-center gap-2'>
                <CircularProgress
                aria-label="Loading..."
                size="md"
                value={infos.pourcentage}
                color="success"
                showValueLabel={true}
                classNames={{
                    value : "text-lg font-bold text-black dark:text-white",
                    svg : "h-16 w-16"
                }}
                />
                <p className='text-black dark:text-white'>{infos.subTitle}</p>
            </div>
        </section>
        <section>
            {
                typeof infos.icon === "function" ? <infos.icon className='size-11 p-1 rounded-md text-black bg-primary-100 dark:text-gray-400'/>
                : <Image src={infos.icon} alt='' height={44} width={44} className='p-1 rounded-md text-black bg-primary-100'/>
            }
        </section>
    </div>
  )
}
