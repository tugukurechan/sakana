import { useNavigate } from 'react-router-dom'
import * as authApi from '../api/auth'
import { useAuth } from '../auth/AuthProvider'

export function MePage() {
  const { user, refresh } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="page">
      <h1 className="pageTitle">マイページ</h1>

      <div className="state">
        <div>username: {user?.username ?? user?.userName ?? 'unknown'}</div>
        <div>displayName: {user?.displayName ?? '-'}</div>
        <div>email: {user?.email ?? '-'}</div>
      </div>

      <div className="pageActions">
        <button
          className="secondaryButton"
          onClick={async () => {
            await authApi.logout().catch(() => null)
            await refresh()
            navigate('/', { replace: true })
          }}
        >
          ログアウト
        </button>
      </div>
    </div>
  )
}

