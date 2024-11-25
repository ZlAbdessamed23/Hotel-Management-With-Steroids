import { BankCardTypes } from '@/app/types/constants';
import { BankCardType } from '@/app/types/types';
import { Button } from '@nextui-org/react';
import React from 'react'

export default function BankCard({infos} : {infos : BankCardType}) {

    function customizeCardNumber(text : string , maskChar : string) : string{
        if (text.length <= 4) return text; 
        const start = text.slice(0, 4); 
        const end = text.slice(-4); 
        const maskedSection = maskChar.repeat(text.length - 8);
        return `${start}${maskedSection}${end}`;
    };


    function calculateDateDifference (date1: Date | string , date2: Date | string): number {
        const d1 = typeof date1 === 'string' ? new Date(date1) : date1;
        const d2 = typeof date2 === 'string' ? new Date(date2) : date2;
    
        const differenceInTime = d2.getTime() - d1.getTime();
        
        const differenceInDays = differenceInTime / (1000 * 3600 * 24);
        return Math.ceil(differenceInDays);
    };


  return (
    <div className='h-[30rem] w-[21.5rem] rounded-xl grid grid-rows-[70%,30%] bg-white text-white font-inter mb-8 dark:bg-slate-800' >
        <section className='bank-card-image-container rounded-t-xl flex justify-center items-center'>
            <div className=' w-11/12 h-[18rem] mx-auto rounded-xl py-4 px-8 flex flex-col gap-12'>
                <span>
                    <p className='text-3xl font-semibold '>{infos.type}</p>
                    <p className='text-medium text-slate-200 opacity-90'>Alg&eacute;rie Poste - Alg&eacute;rie Bank</p>
                </span>
                <span className='tracking-[0.22rem] w-full font-semibold text-lg'>{customizeCardNumber("LKLSLQSKLSQKSLQSKQ" , "*")}</span>
                <span className='flex justify-between items-center'>
                    <div className='flex flex-col items-center gap-4'>
                        <p className='text-slate-200 opacity-90 text-sm'>Administrateur</p>
                        <p className='text-base font-semibold max-w-28 text-ellipsis overflow-hidden whitespace-nowrap'>{infos.userName}</p>
                    </div>
                    <div className='flex flex-col items-center gap-4'>
                        <p className='text-slate-200 opacity-90 text-sm'>Expirer en</p>
                        <p className='text-base font-semibold max-w-28 text-ellipsis overflow-hidden whitespace-nowrap'>{infos.expiration.toString()}</p>
                    </div>
                </span>
            </div>
        </section>
        <section className='text-black p-4 dark:text-white'>
            <h2 className='text-xl text-center font-semibold mb-8'>{calculateDateDifference(new Date() , infos.expiration )} jours pour l&#39;&eacute;xpiration</h2>
            <div className='flex justify-between items-center'>
                <Button color='secondary' variant='shadow'>Payer</Button>
                <Button color='success' className='text-white' variant='shadow'>mise &agrave; niveau</Button>
            </div>
        </section>

    </div>
  )
}
