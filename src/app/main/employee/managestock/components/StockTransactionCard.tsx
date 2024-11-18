"use client"

import {StockTransaction} from '@/app/types/types'
import React from 'react'
import Image, { StaticImageData } from 'next/image'



export default function StockTransactionCard({infos , DisplayIcon , onOpen , setDisplayedItem , index} : {infos : StockTransaction , DisplayIcon : StaticImageData , onOpen : () => void , setDisplayedItem : React.Dispatch<React.SetStateAction<StockTransaction | undefined>> , index : number }) {

    function handleDisplayModal() {
      setDisplayedItem(infos); 
      onOpen();  
    };
    
  return (
    <div className='p-4 grid grid-cols-[75%,25%] gap-4 items-center rounded-lg font-sans bg-white text-black dark:text-white dark:bg-slate-800' onClick={handleDisplayModal}>
      <section className='flex flex-col justify-between w-[96%]'>
        <div className='flex flex-row items-center justify-between'>
          <p className='text-xl font-bold text-primary-500'>Transaction {index + 1}</p>
        </div>
        <p className='text-medium font-medium ml-3 h-12 w-full text-ellipsis overflow-hidden'>{infos.description}</p>
        <p className='text-sm font-light text-secondary-500'>{(infos.createdAt || "").toString()}</p>
      </section>
      <section className='flex flex-col gap-2 items-center'>
        <p className='text-lg font-medium text-primary'>{infos.type}</p>
        <Image src={DisplayIcon} alt='' height={100} width={100} className='p-1 w-full rounded-md'/>
      </section>
    </div>
        
  )
};
