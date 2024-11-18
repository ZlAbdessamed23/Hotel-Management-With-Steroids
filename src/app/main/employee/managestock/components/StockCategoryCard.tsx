"use client"

import {StockCategory} from '@/app/types/types'
import React from 'react'
import Image, { StaticImageData } from 'next/image'



export default function StockCategoryCard({infos , DisplayIcon , onOpen , setDisplayedItem} : {infos : StockCategory , DisplayIcon : StaticImageData , onOpen : () => void , setDisplayedItem : React.Dispatch<React.SetStateAction<StockCategory | undefined>>}) {

    function handleDisplayModal() {
        setDisplayedItem(infos); 
        onOpen();  
    };
    
  return (
    <div className='p-4 grid grid-cols-[20%,80%] gap-4 items-center rounded-lg font-sans bg-white dark:bg-slate-800 dark:text-white' onClick={handleDisplayModal}>
        <section>
            <Image src={DisplayIcon} alt='' height={100} width={100} className='p-1 w-full rounded-md'/>
        </section>
        <section className='flex flex-col justify-between w-[96%]'>
            <div className='flex flex-row items-center justify-between'>
              <p className='text-xl font-bold text-primary-500'>{infos.name}</p>
            </div>
            <p className='text-medium font-medium ml-3 h-12 w-full text-ellipsis overflow-hidden'>{infos.description}</p>
        </section>
    </div>
        
  )
};
