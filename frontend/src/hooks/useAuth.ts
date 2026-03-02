import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth deve ser usado dentro do AuthProvider')
  }

  return context
}

export function useIsAuthenticated() {
  const { isAuthenticated } = useAuth()
  return isAuthenticated
}

export function useUser() {
  const { user } = useAuth()
  return user
}
