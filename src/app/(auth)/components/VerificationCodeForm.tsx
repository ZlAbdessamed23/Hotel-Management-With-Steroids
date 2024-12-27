"use client"

import { VerificationCode } from '@/app/types/types';
import { sendVerficationCode } from '@/app/utils/funcs';
import { Button } from '@nextui-org/react'
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import VerificationInput from 'react-verification-input'

export default function VerificationCodeForm() {
  const router = useRouter();
  const params = useSearchParams();
  const email = params.get("email");
  const collection = params.get("collection");

  const decodedEmail = email ? decodeURIComponent(email) : null;
  const decodedCollection = collection ? decodeURIComponent(collection) : null;

  const [verificationCode, setVerificationCode] = useState<string>("");

  async function handleSendVerificationCode() {
    const data: VerificationCode = {
      collection: decodedCollection as ("admin" | "employee"),
      email: decodedEmail as string,
      resetCode: verificationCode,
    };
    try {
      const response = await sendVerficationCode(data);
      setTimeout(() => {
        router.push("/main");
      }, 3500);
      return response;
    }
    catch (err: any) {
      throw new Error(err);
    };
  }
  async function handleSubmit() {
    const result = handleSendVerificationCode();
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
        <h1 className='text-3xl font-semibold'>Code Vérification</h1>
        <p className='text-base font-light opacity-80'>Entrez le code envoyé sur votre boite email</p>
      </div>
      <form className='flex flex-col gap-4'>
        <VerificationInput
          onChange={(e) => setVerificationCode(e)}
          length={6}
          placeholder="_"
          classNames={{
            container: "flex justify-center items-center space-x-2 w-full pr-3",
            character: "w-12 h-12 text-2xl border border-gray-300 rounded-lg flex items-center justify-center focus:border-blue-500 focus:outline-none transition-colors",
            characterInactive: "bg-gray-100",
            characterSelected: "border-blue-500",
          }}
        />
        <Button variant='solid' color='primary' className='text-black' onClick={() => handleSubmit()} >Connecter</Button>
        <section className='flex flex-col items-center gap-2'>
          <p className='font-light text-medium'>Tous les droits sont conservées</p>
        </section>
      </form>
    </div>)
}
