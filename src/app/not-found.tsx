"use client"

import React from 'react'
import NotFoundImage from "/public/NotFoundImage.svg";
import { Button } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';


export default function NotFound() {
    const router = useRouter();
    return (
        <div className='w-screen h-screen bg-slate-300 dark:bg-gray-900 flex items-center justify-center'>
            <div className='bg-white dark:bg-slate-700 grid grid-cols-2 justify-center items-center text-black dark:text-white px-40 rounded-md w-10/12 h-[30rem]'>
                <section className='flex flex-col gap-6'>
                    <div>
                        <h1 className='text-3xl font-bold'>Oooops</h1>
                        <h2 className='text-2xl font-semibold'>Page Non Trouvée</h2>
                    </div>
                    <div>
                        <p className='text-xl font-medium'>Page introuvable. Nous ne parvenons pas à trouver la page que vous cherchez</p>
                    </div>
                    <div>
                        <Button color='secondary' variant='shadow' onClick={() => router.back()}>Retour</Button>
                    </div>
                </section>
                <section>
                    <Image src={NotFoundImage} alt='not-found-image' width={500} height={500} />
                </section>
            </div>
        </div>
    )
}
