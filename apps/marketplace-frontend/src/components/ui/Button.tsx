import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger'
  isLoading?: boolean
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'primary',
  isLoading = false,
  disabled,
  ...props
}) => {
  const baseStyles =
    'px-4 py-2 rounded font-semibold focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors duration-150'
  let variantStyles = ''

  switch (variant) {
    case 'primary':
      variantStyles =
        'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500'
      break
    case 'secondary':
      variantStyles =
        'bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-gray-400'
      break
    case 'danger':
      variantStyles =
        'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500'
      break
  }

  const disabledStyles = 'disabled:opacity-50 disabled:cursor-not-allowed'

  return (
    <button
      className={`${baseStyles} ${variantStyles} ${disabledStyles} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span
          className='animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full'
          role='status'
          aria-label='loading'
        ></span>
      ) : (
        children
      )}
    </button>
  )
}
