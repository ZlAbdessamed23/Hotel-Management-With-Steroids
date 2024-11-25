import { StaticImageData } from 'next/image'
import React from 'react'
import { IconType } from 'react-icons'
import Image from 'next/image'



export default function LandingCard1({ Icon, title, text }: { Icon: StaticImageData | IconType, title: string, text: string }) {
  return (
    <div className='glass-effect dark:border-none flex flex-col gap-2 py-2 px-4'>
      <section className='flex items-center gap-2 h-8'>
        {
          typeof Icon === "function" ? <Icon className='size-9 p-1 rounded-md text-primary-600' />
            : <Image src={Icon} alt='' height={36} width={36} className='p-1 rounded-md' />
        }
        <span className='text-xl font-semibold text-primary-600'>{title}</span>
      </section>
      <section className='text-lg font-medium'>
        {text}
      </section>
    </div>
  )
}
