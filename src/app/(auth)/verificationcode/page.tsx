import Link from 'next/link'
import React, { Suspense } from 'react'
import VerificationCodeForm from '../components/VerificationCodeForm'
import { Button } from '@nextui-org/react'
import Image from 'next/image'
import BlueBlured from "/public/BlueBlured.svg";



export default function VerificationCode() {
  return (

    <>
    <Suspense fallback={<div>Loading...</div>}>
      <VerificationCodeForm />
    </Suspense>
    </>
  )
}
