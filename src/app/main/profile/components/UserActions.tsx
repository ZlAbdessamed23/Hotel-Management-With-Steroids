"use client"
import useScreenSize from '@/app/components/UseScreenSize';
import { Button, useDisclosure } from '@nextui-org/react'
import React from 'react'
import { CiLogout } from "react-icons/ci";
import { LiaEdit } from "react-icons/lia";
import UpdateEmployeeModal from './UpdateEmployeeModal';
import { SelfUpdateAdmin } from '@/app/types/types';
import UpdateAdminModal from './UpdateAdminModal';
import { logOut } from '@/app/utils/funcs';
import { useRouter } from 'next/navigation';

export default function UserActions({data , userType} : {data : SelfUpdateAdmin | SelfUpdateAdmin , userType : "admin" | "employee"}) {

    const screenSize = useScreenSize();
    const UpdateModal = useDisclosure();
    const router = useRouter();
    
    async function signOut() {
      await logOut().then(() => router.push("/login"));
    };

  return (
    <span className='flex items-center gap-4'>
        <Button variant='bordered' className='bg-transparent text-black' isIconOnly={screenSize === "mobile"} onClick={() => signOut()} startContent={<CiLogout className='size-7' />} >{screenSize !== "mobile" && "Se déconnecter"}</Button>
        <Button onClick={UpdateModal.onOpen} variant='solid' color='primary' className='text-black' isIconOnly={screenSize === "mobile"} startContent={<LiaEdit className='size-7' />} >{screenSize !== "mobile" && "Editer"}</Button>
        {
          userType === "admin" ? <UpdateAdminModal props={UpdateModal} initialData={data} /> : <UpdateEmployeeModal props={UpdateModal} initialData={data} />
        }
    </span>  
    )
}
