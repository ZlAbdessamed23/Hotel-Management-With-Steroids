    // stock + home + gym + rooms

import { FirstCardItemType } from '@/app/types/types'
import React from 'react'
import Image from 'next/image'

export default function CardStyle1({infos} : {infos : FirstCardItemType}) {
  return (
    <div className='py-6 px-4 grid grid-cols-[80%,20%] rounded-lg font-sans bg-white'>
        <section className='flex flex-col items-start'>
            <p className='text-xl font-bold text-secondary-500'>{infos.title}</p>
            <p className='text-lg font-medium mb-2 pl-1'>{infos.currentValue} {infos.subject}</p>
            <p className='font-normal pl-1'>{infos.increaseValue > 0 ? <span className='text-green-600'>+{infos.increaseValue }%</span> :  <span className='text-danger-500'>-{infos.increaseValue }%</span> } depuis la derni&egrave;re</p>
        </section>
        <section>
            {
                typeof infos.icon === "function" ? <infos.icon className='size-9 p-1 rounded-md text-black bg-primary-100'/>
                : <Image src={infos.icon} alt='' height={36} width={36} className='p-1 rounded-md text-black bg-primary-100'/>
            }
        </section>
    </div>
  )
}
