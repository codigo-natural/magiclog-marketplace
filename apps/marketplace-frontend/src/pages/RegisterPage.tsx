import React from 'react'
import { RegisterForm } from '../components/auth/RegisterForm'

export const RegisterPage: React.FC = () => {
  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-gray-100'>
      <RegisterForm />
    </div>
  )
}
