import { Note, Task } from '@/app/types/types'
import React from 'react'
import Image, { StaticImageData } from 'next/image'


export default function CardStyle4({infos , DipslayIcon , onOpen , setDisplayedItem} : {infos : Note | Task , DipslayIcon : StaticImageData , onOpen : () => void , setDisplayedItem : React.Dispatch<React.SetStateAction<Note | Task>>}) {

  function handleDisplayModal() {
    setDisplayedItem(infos);
    onOpen();  
  };

  const difference = new Date().getTime() - new Date(infos.deadline).getTime();
  
  return (
    <div className='p-4 grid grid-cols-[20%,80%] gap-4 items-center rounded-lg font-sans bg-white dark:bg-slate-800' onClick={handleDisplayModal} >
      <section>
        <Image src={DipslayIcon} alt='' className='p-1 w-full rounded-md text-black'/>
      </section>
      <section className='flex flex-col justify-between w-11/12'>
        <div className='flex flex-row items-center justify-between'>
          <p className='text-xl font-bold text-primary-500'>{infos.title}</p>
          <span className={`size-4 rounded-full ${difference >= 0  ? "bg-success-500" : "bg-red-500"}`}></span>
        </div>
        <p className='text-medium font-medium text-black ml-3 h-12 w-full text-ellipsis overflow-hidden mb-1 dark:text-white'>{infos.description}</p>
        <p className='text-sm font-light text-secondary-500'>{new Date(infos.deadline).toISOString().split('T')[0]}</p>
      </section>
    </div>
  )
};
