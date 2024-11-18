import React from 'react'
import UserActions from './UserActions'
import Image from 'next/image'
import { RegisteredEmployee, SelfUpdateEmployee } from '@/app/types/types'
import { UserGender } from '@/app/types/constants';
import MaleUserImage from "/public/MaleUserImage.svg";
import FemaleUserImage from "/public/FemaleUserImage.svg";
import UserDetailsImage from "/public/UserDetailsImage.svg";
import { TranslateObjKeysFromEngToFr } from '@/app/utils/translation';



export default function EmployeeDetails({infos} : {infos : RegisteredEmployee}) {
  const firstPartInfos = {
    name : infos.firstName + "" + infos.lastName,
    dateOfBirth : infos.dateOfBirth,
    phoneNumber : infos.phoneNumber,
    email : infos.email,
    nationality : infos.nationality,
    address : infos.address,
  };

  const secondPartInfos = {
    departement : infos.departement,
    role : infos.role,
    state : infos.state
  };


  return (
    <div className='px-4 py-6 rounded-xl bg-white shadow-sm font-sans flex flex-col gap-8 dark dark:bg-slate-800 dark:text-white'>
      <section className='flex items-center justify-between'>
        <span className='flex items-center gap-4'>
          <p className='h-14 w-3 rounded-full bg-green-400'></p>
          <p className=' text-xl lg:text-2xl lg:font-semibold xl:text-3xl'>D&eacute;tailles de l&#39;Utilisateur</p>
        </span>
        <UserActions data={infos as SelfUpdateEmployee} userType='employee' /> 
      </section>
      <section className='grid gap-4 grid-cols-[30%,70%] lg:gap-0 lg:grid-cols-[20%,80%]'>
        <Image src={infos.gender === UserGender.male ? MaleUserImage  : FemaleUserImage } alt='' width={170} height={170} />
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
          {
            Object.entries((firstPartInfos)).map(([key , value]) => (
              <section key={key} className='flex flex-col items-start gap-2'>
                <span className='text-gray-400 text-opacity-90 text-lg font-medium'>{TranslateObjKeysFromEngToFr(key)}:</span>
                <span className='text-xl font-semibold w-60 h-6 overflow-hidden text-ellipsis'>{String(value)}</span>
              </section>
            ))
          }
        </div>
      </section>
      <section>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {
            Object.entries((secondPartInfos)).map(([key , value]) => (
              <section key={key} className='flex  items-center gap-2 rounded-xl shadow-sm p-2 bg-slate-300 dark:bg-slate-500 '>
                <Image src={UserDetailsImage} alt='' width={50} height={50} />
                <div className='flex flex-col items-start gap-2'>
                  <span className='text-gray-600 text-opacity-90 text-lg font-medium'>{TranslateObjKeysFromEngToFr(key)}:</span>
                  <span className='text-xl font-semibold w-60 h-6 overflow-hidden text-ellipsis'>{String(value)}</span>
                </div>
              </section>
            ))
          }
        </div>
      </section>

    </div>
  )
}
