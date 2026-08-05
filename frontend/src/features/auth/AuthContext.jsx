import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { AuthContext } from './context'
import {
  getAuthenticatedUser,
  login as loginRequest,
  logout as logoutRequest,
} from './services/authService'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function loadUser() {
      try {
        const authenticatedUser = await getAuthenticatedUser()
        if (isMounted) setUser(authenticatedUser)
      } catch {
        if (isMounted) setUser(null)
      } finally {
        if (isMounted) setIsCheckingAuth(false)
      }
    }

    loadUser()

    return () => {
      isMounted = false
    }
  }, [])

  const login = useCallback(async (credentials) => {
    const authenticatedUser = await loginRequest(credentials)
    setUser(authenticatedUser)
    return authenticatedUser
  }, [])

  const logout = useCallback(async () => {
    await logoutRequest()
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isCheckingAuth,
      login,
      logout,
    }),
    [isCheckingAuth, login, logout, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
