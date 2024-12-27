"use client"

import { UserPermission } from '@/app/types/constants';
import { LoggedUser } from '@/app/types/types';
import { Button, Input, Select, SelectItem } from '@nextui-org/react'
import React, { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form';
import { PiEyeClosedBold } from "react-icons/pi";
import { IoEye } from "react-icons/io5";
import Link from 'next/link';
import { signIn } from '@/app/utils/funcs';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
export default function LoginForm() {
  const Permissions = Object.values(UserPermission);
  const router = useRouter();
  const [isPassswordShown , setIsPasswordShown] = useState<boolean>(false);

  const { register, handleSubmit } = useForm<LoggedUser>({
    defaultValues: {
      email: "",
      password : "",
      permission : UserPermission.admin,
    },
  });

  async function handleLogin(data : LoggedUser) {
    try{
      const response = await signIn(data);
      setTimeout(()=> {
        router.push("/main");
      },3500);
      return response;
    }
    catch(err : any){
      throw new Error(err);
    };
  };

  const onSubmit : SubmitHandler<LoggedUser> = async (data) => {
    const result = handleLogin(data);
    await toast.promise(result, {
      loading: 'Loading...',
      success: (data) => `${data}`,
      error: (err) => `${err.toString()}`,
    }
    );
  };
      
  return (
    <div className='glass-effect w-96 p-6 pt-8 pb-4 font-sans flex flex-col gap-6 absolute left-[5%] top-[85%] sm:top-[80%] sm:left-1/4 md:left-[17%] md:top-[80%] xl:right-[10%] xl:top-[15%] xl:left-auto z-50'>
      <div>
        <h1 className='text-3xl font-semibold'>Connectez-vous</h1>
        <p className='text-base font-light opacity-80'>Un peu d&#39;informations pour entrer svp!!</p>
      </div>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit(onSubmit)}>
      <Input variant='bordered' className='next-ui-bordered-input-container' type='email'  label="Email" {...register('email')} />
      <div className='relative border-2 border-black rounded-xl next-ui-input-container'>
        <Input variant='bordered' type={isPassswordShown ? "text" : "password"} className=' w-11/12 bg-transparent' label="Mot de Passe" {...register('password')} />
        <Button isIconOnly variant='flat' className=' absolute right-0 top-0 h-full bg-transparent border-0 hover:bg-slate-200 hover:opacity-5' onClick={() =>setIsPasswordShown((prev) => !prev) }>{isPassswordShown ? <IoEye className='size-5' /> : <PiEyeClosedBold className='size-5' />}</Button>
      </div>
      <Select label="Rôle" className="w-full next-ui-select-container" {...register('permission')}>
        {Permissions.map((permission) => (
          <SelectItem key={permission} value={permission}>
            {permission}
          </SelectItem>
        ))}
      </Select>
      <Button variant='solid' color='primary' className='text-black'  type='submit'>Login</Button>
      <section className='flex flex-col items-center gap-2'>
        <Link href="/forgotpassword" className='font-light text-medium'>mot de passe oubli&eacute;?</Link>
        <p className='font-light text-medium'>Tous les droits sont conserv&eacute;es</p>
      </section>
      </form>
    </div>
  )
}
