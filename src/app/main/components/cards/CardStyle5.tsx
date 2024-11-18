import React from 'react'
import Image from 'next/image'
import { FifthCardItemType } from '@/app/types/types'
export default function CardStyle5({ infos }: { infos: FifthCardItemType }) {
  return (
    <div className='py-6 px-4 grid grid-cols-[50%,50%] lg:grid-cols-[65%,35%] h-52 rounded-lg font-sans bg-white w-[30rem] dark:bg-slate-800'>
      <section className='flex flex-col items-start gap-4'>
        <p className='text-3xl font-bold text-secondary-500'>{infos.title}</p>
        <p className='text-xl font-semibold mb-2 pl-4'><span className='text-2xl'>{infos.currentValue}</span> {infos.subject}</p>
        <p className='text-xl font-semibold mb-2 pl-4'><span className='text-2xl'>{infos.pourcentage + "%"}</span>{" " + infos.speciality}</p>
      </section>
      <section>
        <Image src={infos.icon} alt='' height={100} width={100} className=' h-36 w-36 p-1 rounded-md text-black lg:w-full lg:h-44' />
      </section>
    </div>
  )
}
