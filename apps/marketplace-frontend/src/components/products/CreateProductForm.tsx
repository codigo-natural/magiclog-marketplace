import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import apiClient from '../../services/api'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'

export const CreateProductForm: React.FC = () => {
  const [name, setName] = useState('')
  const [sku, setSku] = useState('')
  const [quantity, setQuantity] = useState('') // String para el input, se convertirá a número
  const [price, setPrice] = useState('') // String para el input
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccessMessage(null)

    if (!name || !sku || !quantity || !price) {
      setError('Todos los campos son obligatorios.')
      return
    }
    const numQuantity = parseInt(quantity, 10)
    const numPrice = parseFloat(price)

    if (isNaN(numQuantity) || numQuantity < 0) {
      setError('La cantidad debe ser un número no negativo.')
      return
    }
    if (isNaN(numPrice) || numPrice <= 0) {
      setError('El precio debe ser un número positivo.')
      return
    }

    setIsLoading(true)

    try {
      await apiClient.post('/products', {
        name,
        sku,
        quantity: numQuantity,
        price: numPrice,
      })
      setSuccessMessage('Producto creado exitosamente!')
      // Limpiar formulario
      setName('')
      setSku('')
      setQuantity('')
      setPrice('')
      // Opcional: redirigir a la lista de productos del vendedor
      navigate('/seller/products/me')
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || 'Error al crear el producto.'
      if (Array.isArray(errorMessage)) {
        // NestJS class-validator puede devolver un array
        setError(errorMessage.join(', '))
      } else {
        setError(errorMessage)
      }
      console.error(
        'Error creando producto:',
        err.response?.data || err.message
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className='space-y-6 bg-white p-8 rounded-lg shadow-md w-full max-w-lg'
    >
      <h2 className='text-2xl font-bold text-center text-gray-800'>
        Crear Nuevo Producto
      </h2>
      {error && (
        <p className='text-red-500 text-sm bg-red-100 p-3 rounded'>{error}</p>
      )}
      {successMessage && (
        <p className='text-green-600 text-sm bg-green-100 p-3 rounded'>
          {successMessage}
        </p>
      )}

      <Input
        label='Nombre del Producto'
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <Input
        label='SKU'
        value={sku}
        onChange={(e) => setSku(e.target.value)}
        required
      />
      <Input
        label='Cantidad'
        type='number'
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        required
        min='0'
      />
      <Input
        label='Precio'
        type='number'
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
        min='0.01'
        step='0.01'
      />

      <Button
        type='submit'
        className='w-full'
        isLoading={isLoading}
        disabled={isLoading}
      >
        Crear Producto
      </Button>
    </form>
  )
}
