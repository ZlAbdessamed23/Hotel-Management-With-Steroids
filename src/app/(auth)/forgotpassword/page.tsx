import { Button } from '@nextui-org/react'
import React, { Suspense } from 'react'
import Image from 'next/image'
import BlueBlured from "/public/BlueBlured.svg";
import ForgotPasswordForm from '../components/ForgotPasswordForm';

export default function ForgotPassword() {

  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <ForgotPasswordForm />
      </Suspense>

    </>
  )
}
