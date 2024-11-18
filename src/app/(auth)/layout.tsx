import { Button } from '@nextui-org/react'
import Link from 'next/link'
import React from 'react'
import Image from 'next/image'
import BlueBlured from "/public/BlueBlured.svg";


export default function layout({ children }: { children: React.ReactNode }) {

  return (
    <div className='h-screen w-screen overflow-x-hidden bg-gray-50 text-black relative font-sans auth-page p-b-10  dark:bg-black dark:text-white'>
      <section className='absolute left-0 w-full sm:left-[10%] top-[25%] md:w-[35rem] p-4'>
        <p className='font-bold text-5xl text-center mb-8'>Bonjour</p>
        <p className='text-4xl font-medium text-center leading-10'>Veuillez saisir vos informations pour accéder à notre système de gestion hôtelière et optimiser votre flux de travail.</p>
        <div className='p-4 flex flex-row items-center justify-center gap-4'>
          <Link href="/login"><Button variant='solid' color='primary'>Connecter</Button></Link>
          <Link href="/register"><Button variant='solid' className='bg-transparent' >Inscriver</Button></Link>
        </div>
      </section>
      <Image src={BlueBlured} alt='img' width={1800} height={600} className='absolute top-0 md:top-[-10%] xl:top-[-55%] right-0' />
      {/* <Button onClick={() => }>Dark/Lite</Button> */}
      {children}
    </div>)
}
