import React from 'react'
import UserActions from './UserActions'
import Image from 'next/image'
import { RegisteredAdmin,SelfUpdateAdmin } from '@/app/types/types'
import { UserGender } from '@/app/types/constants';
import MaleUserImage from "/public/MaleUserImage.svg";
import FemaleUserImage from "/public/FemaleUserImage.svg";

type AdminDetailsType = Omit<RegisteredAdmin, 'password' | 'gender'> & {
  gender: string;
};

export default function AdminDetails({ infos }: { infos: AdminDetailsType }) {

  return (
    <div className='px-4 py-6 rounded-xl bg-white shadow-sm font-sans flex flex-col gap-8 dark dark:bg-slate-800 dark:text-white'>
      <section className='flex items-center justify-between'>
        <span className='flex items-center gap-4'>
          <p className='h-14 w-3 rounded-full bg-green-400'></p>
          <p className=' text-xl lg:text-2xl lg:font-semibold xl:text-3xl'>D&eacute;tailles de l`&#39;Utilisateur</p>
        </span>
        <UserActions data={infos as SelfUpdateAdmin} userType='admin' /> 
      </section>
      <section className='grid gap-4 grid-cols-[30%,70%] lg:gap-0 lg:grid-cols-[20%,80%]'>
        <Image src={infos.gender === UserGender.male ? MaleUserImage : FemaleUserImage} alt='' width={170} height={170} />
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
          <section className='flex flex-col items-start gap-1'>
            <span className='text-gray-400 text-opacity-90 text-lg font-medium'>Nom : </span>
            <span className=' text-xl font-semibold w-60 h-6 overflow-hidden text-ellipsis'>{String(infos.firstName)}</span>
          </section>
          <section className='flex flex-col items-start gap-1'>
            <span className='text-gray-400 text-opacity-90 text-lg font-medium'>Pr&eacute;nom : </span>
            <span className=' text-xl font-semibold w-60 h-6 overflow-hidden text-ellipsis'>{String(infos.lastName)}</span>
          </section>
          <section className='flex flex-col items-start gap-1'>
            <span className='text-gray-400 text-opacity-90 text-lg font-medium'>Email </span>
            <span className=' text-xl font-semibold w-60 h-6 overflow-hidden text-ellipsis'>{String(infos.email)}</span>
          </section>
          <section className='flex flex-col items-start gap-1'>
            <span className='text-gray-400 text-opacity-90 text-lg font-medium'>T&eacute;l&eacute;phone : </span>
            <span className=' text-xl font-semibold w-60 h-6 overflow-hidden text-ellipsis'>{String(infos.phoneNumber)}</span>
          </section>
          <section className='flex flex-col items-start gap-1'>
            <span className='text-gray-400 text-opacity-90 text-lg font-medium'>Addresse : </span>
            <span className=' text-xl font-semibold w-60 h-6 overflow-hidden text-ellipsis'>{String(infos.address)}</span>
          </section>
          <section className='flex flex-col items-start gap-1'>
            <span className='text-gray-400 text-opacity-90 text-lg font-medium'>Date de Naissance : </span>
            <span className=' text-xl font-semibold w-60 h-6 overflow-hidden text-ellipsis'>{infos.dateOfBirth.toString()}</span>
          </section>
          <section className='flex flex-col items-start gap-1'>
            <span className='text-gray-400 text-opacity-90 text-lg font-medium'>Nationalit&eacute; : </span>
            <span className=' text-xl font-semibold w-60 h-6 overflow-hidden text-ellipsis'>{String(infos.nationality)}</span>
          </section>
          <section className='flex flex-col items-start gap-1'>
            <span className='text-gray-400 text-opacity-90 text-lg font-medium'>Sexe : </span>
            <span className=' text-xl font-semibold w-60 h-6 overflow-hidden text-ellipsis'>{String(infos.gender)}</span>
          </section>
        </div>
      </section>
      <section>
      </section>

    </div>
  )
}
