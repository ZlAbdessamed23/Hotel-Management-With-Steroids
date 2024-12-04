import React, { Suspense } from 'react'
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
