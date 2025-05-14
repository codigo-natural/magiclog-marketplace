import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input: React.FC<InputProps> = ({
  id,
  label,
  error,
  className,
  ...props
}) => {
  return (
    <div className='mb-4'>
      {label && (
        <label
          htmlFor={id || props.name}
          className='block text-sm font-medium text-gray-700 mb-1'
        >
          {label}
        </label>
      )}
      <input
        id={id || props.name}
        className={`mt-1 block w-full px-3 py-2 border ${
          error ? 'border-red-500' : 'border-gray-300'
        } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${className}`}
        {...props}
      />
      {error && <p className='mt-1 text-xs text-red-600'>{error}</p>}
    </div>
  )
}
