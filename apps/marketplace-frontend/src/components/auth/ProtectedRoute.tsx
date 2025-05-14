import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'

interface ProtectedRouteProps {
  isAuthenticated: boolean
  allowedRoles?: string[]
  userRole?: string
  redirectPath?: string
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  isAuthenticated,
  allowedRoles,
  userRole,
  redirectPath = '/login',
}) => {
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to={redirectPath} state={{ from: location }} replace />
  }

  if (allowedRoles && userRole && !allowedRoles.includes(userRole)) {
    // usuario autenticado pero no tiene el rol permitido
    // podriamos redirigir a una página de "No autorizado" o a la home
    return <Navigate to='/' state={{ from: location }} replace />
  }

  return <Outlet /> // Renderiza el componente hijo si esta autenticado y tiene el rol (si se especifica)
}
