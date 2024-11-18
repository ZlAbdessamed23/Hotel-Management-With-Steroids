"use client"

import {Restau_CafeteriaItem} from '@/app/types/types'
import React from 'react'
import Image, { StaticImageData } from 'next/image'



export default function CardStyle7({infos , DisplayIcon , onOpen , setDisplayedItem} : {infos : Restau_CafeteriaItem , DisplayIcon : StaticImageData , onOpen : () => void , setDisplayedItem : React.Dispatch<React.SetStateAction<Restau_CafeteriaItem>>}) {

    function handleDisplayModal() {
        setDisplayedItem(infos); 
        onOpen();  
    };
    
  return (
    <div className='p-4 grid grid-cols-[20%,80%] gap-4 items-center rounded-lg font-sans bg-white dark:bg-slate-800' onClick={handleDisplayModal}>
        <section>
            <Image src={DisplayIcon} alt='w??' height={100} width={100} className='p-1 w-full rounded-md text-black'/>
        </section>
        <section className='flex flex-col justify-between w-[96%]'>
            <div className='flex flex-row items-center justify-between'>
                <p className='text-xl font-bold text-primary-500 w-32 truncate ...'>{infos.name}</p>
            </div>
            <p className='text-medium font-medium text-black ml-3 h-12 w-40 truncate text-ellipsis overflow-hidden dark:text-white'>{infos.description}</p>
            <p className='text-sm font-light text-secondary-500 dark:text-white'>{infos.category}</p>
        </section>
    </div>
        
  )
};
