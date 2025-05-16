import type React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import apiClient from '../../services/api'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'

export const RegisterForm: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.')
      return
    }
    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.')
      return
    }

    setIsLoading(true)
    try {
      await apiClient.post('/auth/register', {
        email,
        password,
        confirmPassword,
      })
      navigate('/login', {
        state: { message: 'Registro exitoso. Por favor, inicia sesión.' },
      })
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        'Error en el registro. Inténtalo de nuevo.'
      setError(errorMessage)
      console.error('Error en registro:', err.response?.data || err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className='space-y-6 bg-white p-8 rounded-lg shadow-md w-full max-w-md'
    >
      <h2 className='text-2xl font-bold text-center text-gray-800'>
        Registrar Vendedor
      </h2>
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
      <Input
        label='Confirmar Contraseña'
        type='password'
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
        placeholder='********'
      />
      <Button
        type='submit'
        className='w-full'
        isLoading={isLoading}
        disabled={isLoading}
      >
        Registrar
      </Button>
    </form>
  )
}
