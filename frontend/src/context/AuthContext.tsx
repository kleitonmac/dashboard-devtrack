import { createContext, useState, useEffect } from 'react'
import { authAPI } from '../services/api'

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Carregar user: primeiro do localStorage, depois consulta em tempo real no banco (xp, level atualizados)
  useEffect(() => {
    const token = localStorage.getItem('authToken')
    const savedUser = localStorage.getItem('user')

    if (savedUser && token) {
      try {
        setUser(JSON.parse(savedUser))
      } catch {
        localStorage.removeItem('user')
        localStorage.removeItem('authToken')
      }
    }

    const syncUserFromDb = async () => {
      if (!token) {
        setIsLoading(false)
        return
      }
      try {
        const { data } = await authAPI.getMe()
        if (data?.user) {
          setUser(data.user)
          localStorage.setItem('user', JSON.stringify(data.user))
        }
      } catch {
        // Token inválido ou rede: mantém user do localStorage
      }
      setIsLoading(false)
    }

    syncUserFromDb()
  }, [])

  const login = async (email, password) => {
    setIsLoading(true)
    setError(null)
    try {
      const { data } = await authAPI.login({ email, password })
      const { token, user: userData } = data

      localStorage.setItem('authToken', token)
      localStorage.setItem('user', JSON.stringify(userData))
      setUser(userData)

      return { success: true, user: userData }
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        (err.code === 'ERR_NETWORK'
          ? 'Não foi possível conectar ao servidor. Verifique sua conexão e se o backend está no ar (e CORS liberado para este site).'
          : err.code === 'ERR_CANCELED'
            ? 'Requisição cancelada.'
            : 'Erro ao fazer login.')
      setError(message)
      return { success: false, error: message }
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (name, email, password) => {
    setIsLoading(true)
    setError(null)
    try {
      const { data } = await authAPI.register({ name, email, password })
      const { token, user: userData } = data

      localStorage.setItem('authToken', token)
      localStorage.setItem('user', JSON.stringify(userData))
      setUser(userData)

      return { success: true, user: userData }
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        (err.code === 'ERR_NETWORK'
          ? 'Não foi possível conectar ao servidor. Verifique sua conexão e se o backend está no ar (e CORS liberado para este site).'
          : err.code === 'ERR_CANCELED'
            ? 'Requisição cancelada.'
            : 'Erro ao registrar.')
      setError(message)
      return { success: false, error: message }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    authAPI.logout()
    setUser(null)
    setError(null)
  }

  const updateUser = (updatedData) => {
    const newUser = { ...user, ...updatedData }
    setUser(newUser)
    localStorage.setItem('user', JSON.stringify(newUser))
  }

  /** Sincroniza user com o banco (consulta em tempo real: xp, level, etc.) */
  const refreshUser = async () => {
    const token = localStorage.getItem('authToken')
    if (!token) return
    try {
      const { data } = await authAPI.getMe()
      if (data?.user) {
        setUser(data.user)
        localStorage.setItem('user', JSON.stringify(data.user))
      }
    } catch {
      // ignora erro
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        login,
        register,
        logout,
        updateUser,
        refreshUser,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
