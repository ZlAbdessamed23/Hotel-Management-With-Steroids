"use client"

import { ForgotPassword } from '@/app/types/types';
import { sendForgetPasswordCode } from '@/app/utils/funcs';
import { Button, Input, Select, SelectItem } from '@nextui-org/react'
import { useRouter } from 'next/navigation';
import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';


export default function ForgotPasswordForm() {

  const router = useRouter();
  const { register, handleSubmit , watch } = useForm<ForgotPassword>({
    defaultValues: {
      email: "",
      collection: "admin",
    },
  });

  async function handleSendForgetPasswordCode(data : ForgotPassword) {
    const response = await sendForgetPasswordCode(data);
    const searchParams = new URLSearchParams({
      email: data.email,
      collection: data.collection
    });
    setTimeout(() => {
      router.push(`/verificationcode?${searchParams.toString()}`);
    },3500);
    return response;
  };

  const onSubmit: SubmitHandler<ForgotPassword> = async(data) => {
    const result = handleSendForgetPasswordCode(data);
    await toast.promise(result, {
      loading: 'Loading...',
      success: (data) => `${data}`,
      error: (err) => `${err.toString()}`,
    }
    );
  };

  return (
    <div className='glass-effect w-96 p-6 pt-8 pb-4 font-sans flex flex-col gap-6 absolute right-[10%] top-[25%] z-50 '>
      <div>
        <h1 className='text-3xl font-semibold'>Mot de Passe Oubli&eacute;e</h1>
        <p className='text-base font-light opacity-80'>Entrer votre email pour recevoire le code de v&eacute;rification</p>
      </div>
      <form className='flex flex-col gap-4'>
        <Input variant='bordered' className='next-ui-bordered-input-container' type='email' label="Email" {...register('email')} />
        <Select label="Rôle" className="w-full next-ui-select-container" {...register('collection')}>
          <SelectItem key={"employee"}  value={"employee"}>
            Employ&eacute;e
          </SelectItem>
          <SelectItem key={"admin"}  value={"admin"}>
            Admin
          </SelectItem>
        </Select>
        <Button variant='solid' color='primary' className='text-black' type='submit' onClick={handleSubmit(onSubmit)} >Envoyer le code d&#39;Activation</Button>
        <section className='flex flex-col items-center gap-2'>
          <p className='font-light text-medium'>Tous les droits sont conserv&eacute;es</p>
        </section>
      </form>
    </div>
  )
}
