"use client"

import { UserGender } from '@/app/types/constants';
import { RegistrationInfos } from '@/app/types/types';
import { Button, Input } from '@nextui-org/react';
import React, { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form';
import { IoEye } from 'react-icons/io5';
import { PiEyeClosedBold } from 'react-icons/pi';
import { IoIosArrowRoundBack } from "react-icons/io";
import { signUp } from '@/app/utils/funcs';
import { useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';

export default function RegisterForm() {

  const params = useSearchParams();
  const plan = params.get("plan") || "Standard";
  const [isPassswordShown, setIsPasswordShown] = useState<boolean>(false);
  const [isAdminInfosFormShown, setIsAdminInfosFormShown] = useState<boolean>(true);

  const { register, handleSubmit, reset } = useForm<RegistrationInfos>({
    defaultValues: {
      firstName: "",
      lastName: "",
      address: "",
      dateOfBirth: "",
      gender: UserGender.male,
      phoneNumber: "",
      email: "",
      nationality: "",
      password: "",
      hotelName: "",
      hotelAddress: "",
      hotelEmail: "",
      hotelPhoneNumber: "",
      country: "",
      cardNumber: "",
    },
  });

  async function handleRegister(data: RegistrationInfos) {
    try {
      const response = await signUp(data, plan);
      reset({
        firstName: "",
        lastName: "",
        address: "",
        dateOfBirth: "",
        gender: UserGender.male,
        phoneNumber: "",
        email: "",
        nationality: "",
        password: "",
        hotelName: "",
        hotelAddress: "",
        hotelEmail: "",
        hotelPhoneNumber: "",
        country: "",
        cardNumber: "",
      });
      return response;
    }
    catch (err: any) {
      throw new Error(err);
    };
  };

  function handlePassToSecondForm(e: React.FormEvent) {
    e.preventDefault();
    setIsAdminInfosFormShown(false);
  };

  const onSubmit: SubmitHandler<RegistrationInfos> = async (data) => {
    const result = handleRegister(data);
    await toast.promise(result, {
      loading: 'Loading...',
      success: (data) => `${data}`,
      error: (err) => `${err.toString()}`,
    });
  };

  const AdminInfosForm: React.JSX.Element = (<form className='flex flex-col gap-4' onSubmit={(e) => handlePassToSecondForm(e)}>
    <Input variant='bordered' className='next-ui-bordered-input-container' type='text' label="Nom" {...register('firstName')} />
    <Input variant='bordered' className='next-ui-bordered-input-container' type='text' label="Prénom" {...register('lastName')} />
    <Input variant='bordered' className='next-ui-bordered-input-container' type='email' label="Email" {...register('email')} />
    <Input variant='bordered' className='next-ui-bordered-input-container' type='text' label="Numéro de Téléphone" {...register('phoneNumber')} />
    <Input variant='bordered' className='next-ui-bordered-input-container' type='text' label="Nationalité" {...register('nationality')} />
    <Input variant='bordered' className='next-ui-bordered-input-container' type='text' label="Addresse" {...register('address')} />
    <Input variant='bordered' className='next-ui-bordered-input-container' type='date' label="Date de Naissance" {...register('dateOfBirth')} />
    <div className='relative border-2 border-black rounded-xl next-ui-input-container'>
      <Input variant='bordered' type={isPassswordShown ? "text" : "password"} className=' w-11/12 bg-transparent' label="Mot de Passe" {...register('password')} />
      <Button isIconOnly variant='flat' className=' absolute right-0 top-0 h-full bg-transparent border-0 hover:bg-slate-200 hover:opacity-5' onClick={() => setIsPasswordShown((prev) => !prev)}>{isPassswordShown ? <IoEye className='size-5' /> : <PiEyeClosedBold className='size-5' />}</Button>
    </div>
    <Button variant='solid' color='primary' className='text-black' type='submit'>Informations de l&#39;Hotel</Button>
    <section className='flex flex-col items-center gap-2'>
      <p className='font-light text-medium'>Tous les droits sont conserv&eacute;es</p>
    </section>
  </form>);


  const HotelInfosForm: React.JSX.Element = (<form className='flex flex-col gap-4' onSubmit={handleSubmit(onSubmit)}>
    <Input variant='bordered' className='next-ui-bordered-input-container' type='text' label="Nom de l'Hotel" {...register('hotelName')} />
    <Input variant='bordered' className='next-ui-bordered-input-container' type='email' label="Email" {...register('hotelEmail')} />
    <Input variant='bordered' className='next-ui-bordered-input-container' type='text' label="Addresse" {...register('hotelAddress')} />
    <Input variant='bordered' className='next-ui-bordered-input-container' type='text' label="Pays" {...register('country')} />
    <Input variant='bordered' className='next-ui-bordered-input-container' type='text' label="Numéro de Téléphone" {...register('hotelPhoneNumber')} />
    <Input variant='bordered' className='next-ui-bordered-input-container' type='text' label="Numéro de Carte Banquaire ou CCP" {...register('cardNumber')} />
    <Button variant='solid' color='primary' className='text-black' type='submit' onSubmit={handleSubmit(onSubmit)} >Inscrire</Button>
    <p className='font-light text-medium w-36 p-1 mx-auto flex flex-row items-center justify-center gap-1 cursor-pointer return-p' onClick={() => setIsAdminInfosFormShown(true)}><IoIosArrowRoundBack className='size-6 transition-transform' />Retourner</p>
    <section className='flex flex-col items-center gap-2'>
      <p className='font-light text-medium'>Tous les droits sont conserv&eacute;es</p>
    </section>
  </form>);






  return (
    <div className='glass-effect w-96 p-6 pt-8 pb-4 font-sans flex flex-col gap-6 absolute left-[5%] top-[85%] sm:top-[80%] sm:left-1/4 md:left-[17%] md:top-[80%] xl:right-[10%] xl:top-[15%] xl:left-auto z-50'>
      <div>
        <h1 className='text-3xl font-semibold'>Inscrivez-vous</h1>
        <p className='text-base font-light opacity-80'>Un peu d`&#39;informations pour entrer svp!!</p>
      </div>
      {
        isAdminInfosFormShown ? AdminInfosForm : HotelInfosForm
      }
    </div>
  )
}
