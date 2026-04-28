import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import type { Role } from '../types'

export function ProtectedRoute({ role }: { role?: Role }) {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/auth" replace />
  }

  if (role && user.role !== role) {
    return <Navigate to={user.role === 'ADMIN' ? '/admin' : '/dashboard'} replace />
  }

  return <Outlet />
}
