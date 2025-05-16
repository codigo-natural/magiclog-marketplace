import React, { useState } from 'react'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import {
  loginFailure,
  loginRequest,
  loginSuccess,
  type UserState,
} from '../../store/features/auth/authSlice'
import apiClient from '../../services/api'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { jwtDecode } from 'jwt-decode'

interface DecodedToken {
  sub: string //userId
  email: string
  role: string
  iat: number
  exp: number
}

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useAppDispatch()
  const { isLoading, error } = useAppSelector((state) => state.auth)

  const from = location.state?.from?.pathname || '/'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    dispatch(loginRequest())
    try {
      const response = await apiClient.post<{ accesToken: string }>(
        '/auth/login',
        { email, password }
      )
      const { accesToken } = response.data
      const decodedToken = jwtDecode<DecodedToken>(accesToken) 
      const userPayload : UserState = {
        id: decodedToken.sub,
        email: decodedToken.email,
        role: decodedToken.role,
      }

      dispatch(loginSuccess({ token: accesToken, user: userPayload }))
      if (decodedToken.role === 'admin') {
        navigate('/admin/dashboard', { replace: true })
      } else if (decodedToken.role === 'seller') {
        navigate('/seller/dashboard', { replace: true })
      } else {
        navigate(from, { replace: true })
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        'Error en el login. Verifica tus credenciales.'
      dispatch(loginFailure(errorMessage))
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className='space-y-6 bg-white p-8 rounded-lg shadow-md w-full max-w-md'
    >
      <h2 className='text-2xl font-bold text-center text-gray-800'>
        Iniciar Sesión
      </h2>
      {location.state?.message && (
        <p className='text-green-600 bg-green-100 p-3 rounded'>
          {location.state.message}
        </p>
      )}
      {error && (
        <p className='text-red-500 text-sm bg-red-100 p-3 rounded'>{error}</p>
      )}
      <Input
        label='Email'
        type='email'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        placeholder='tu@email.com'
      />
      <Input
        label='Contraseña'
        type='password'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        placeholder='********'
      />
      <Button
        type='submit'
        className='w-full'
        isLoading={isLoading}
        disabled={isLoading}
      >
        Entrar
      </Button>
    </form>
  )
}
