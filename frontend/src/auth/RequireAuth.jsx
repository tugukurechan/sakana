import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './AuthProvider'

export function RequireAuth({ children }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) return <div className="state">読み込み中…</div>
  if (!user) {
    const returnTo = location.pathname + location.search
    return <Navigate to={`/login?returnTo=${encodeURIComponent(returnTo)}`} replace />
  }

  return children
}

