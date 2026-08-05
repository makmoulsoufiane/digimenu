import { Navigate, Outlet } from 'react-router-dom'
import { ROUTES } from '../../shared/constants/routes'
import { useAuth } from './useAuth'

function ProtectedRoute() {
  const { isAuthenticated, isCheckingAuth } = useAuth()

  if (isCheckingAuth) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#f5f7f8] text-[#124b61]">
        <p className="text-sm font-bold">Checking session...</p>
      </main>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.login} replace />
  }

  return <Outlet />
}

export default ProtectedRoute
