import React from 'react'
import { Hotel } from '@/app/types/types'
import Image from 'next/image'


export default function HotelDetails({ infos }: { infos:Hotel}) {

  return (
    <div className='px-4 py-6 rounded-xl bg-white shadow-sm font-sans flex flex-col gap-8 dark dark:bg-slate-800 dark:text-white'>
      <section className='flex items-center justify-between'>
        <span className='flex items-center gap-4'>
          <p className='h-14 w-3 rounded-full bg-green-400'></p>
          <p className=' text-xl lg:text-2xl lg:font-semibold xl:text-3xl'>D&eacute;tailles de l&#39;Hotel</p>
        </span>
      </section>
      <section className='block md:grid md:grid-cols-[20%,80%]'>
        <Image src="" alt='' />
        <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'>
          <section className='flex flex-col items-start gap-1'>
            <span className='text-gray-400 text-opacity-90 text-lg font-medium'>Nom : </span>
            <span className=' text-xl font-semibold w-60 h-6 overflow-hidden text-ellipsis'>{String(infos.hotelName)}</span>
          </section>

          <section className='flex flex-col items-start gap-1'>
            <span className='text-gray-400 text-opacity-90 text-lg font-medium'>Email </span>
            <span className=' text-xl font-semibold w-60 h-6 overflow-hidden text-ellipsis'>{String(infos.hotelEmail)}</span>
          </section>
          <section className='flex flex-col items-start gap-1'>
            <span className='text-gray-400 text-opacity-90 text-lg font-medium'>T&eacute;l&eacute;phone : </span>
            <span className=' text-xl font-semibold w-60 h-6 overflow-hidden text-ellipsis'>{String(infos.hotelPhoneNumber)}</span>
          </section>
          <section className='flex flex-col items-start gap-1'>
            <span className='text-gray-400 text-opacity-90 text-lg font-medium'>Addresse : </span>
            <span className=' text-xl font-semibold w-60 h-6 overflow-hidden text-ellipsis'>{String(infos.hotelAddress)}</span>
          </section>
          <section className='flex flex-col items-start gap-1'>
            <span className='text-gray-400 text-opacity-90 text-lg font-medium'>Pays : </span>
            <span className=' text-xl font-semibold w-60 h-6 overflow-hidden text-ellipsis'>{String(infos.country)}</span>
          </section>
          <section className='flex flex-col items-start gap-1'>
            <span className='text-gray-400 text-opacity-90 text-lg font-medium'>Num&eacute;ro de carte bancaire : </span>
            <span className=' text-xl font-semibold w-60 h-6 overflow-hidden text-ellipsis'>{String(infos.cardNumber)}</span>
          </section>
        </div>
      </section>
      <section>
      </section>

    </div>
  )
}
