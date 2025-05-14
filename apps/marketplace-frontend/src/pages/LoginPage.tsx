import React from 'react'
import { LoginForm } from '../components/auth/LoginForm'
import { Link } from 'react-router-dom'

export const LoginPage: React.FC = () => {
  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-gray-100'>
      <LoginForm />
      <p className='mt-4 text-center text-sm text-gray-600'>
        ¿No tienes cuenta?{' '}
        <Link
          to='/register'
          className='font-medium text-blue-600 hover:text-blue-500'
        >
          Regístrate aquí
        </Link>
      </p>
    </div>
  )
}
