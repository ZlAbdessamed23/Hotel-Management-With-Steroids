import React, { Suspense } from 'react'
import RegisterForm from '../components/RegisterForm'




export default function Register() {
  return (
  <>
  <Suspense fallback={<div>Loading...</div>}>
    <RegisterForm />
  </Suspense>
  </>
  )
}
