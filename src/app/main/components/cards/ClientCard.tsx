import { CardType, Client, DataType, EventInvited, EventOrganiser, Reservation } from '@/app/types/types'
import React from 'react'
import ClientImage from "/public/ClientImage.svg";
import ReservationImage from "/public/ReservationImage.svg";
import Image from 'next/image';
import { TranslateObjKeysFromEngToFr } from '@/app/utils/translation';

type DisplayCardProps = Client | Reservation | EventInvited | EventOrganiser;

export default function ClientCard<T extends DisplayCardProps>({props , type , index} : {props : T , type : CardType , index : number}) {

  return (
    <div className='w-[395px] rounded-xl h-[760px] overflow-y-hidden bg-white text-white relative'>
        <section className='!bg-gradient-to-r !from-secondary !via-secondary-700 !to-secondary h-[182px] p-6 rounded-tl-xl rounded-tr-xl '>
            <p className='text-3xl font-semibold text-center mb-4 dark:text-black'>{type === "client" ? `Membre${index + 1}` : `Reservation`}</p>
            {
                type === "client" && 'fullName' in props && <p className='text-xl font-light text-gray-300 dark:text-gray-700 opacity-85 text-center'>{props.fullName}</p>
            }
        </section>
        <section className='p-4 pt-16 flex flex-col gap-3'>
            {
                Object.entries(props).map(([key , value]) => (
                    !(key.includes("id") || key.includes("Id")) && <section key={key} className='flex flex-row items-center gap-4'>
                        <span className='text-secondary  font-semibold'>{TranslateObjKeysFromEngToFr(key)}:</span>
                        <span className='text-black w-60 truncate'>{String(value)}</span>
                    </section>
                ))
            }
        </section>
        <Image src={type === "client" ? ClientImage : ReservationImage} alt='' height={100} width={100} className='absolute top-[17%] left-[35%]' />
    </div>
  )
}
