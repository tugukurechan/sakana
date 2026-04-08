import { Link, Outlet } from 'react-router-dom'
import { useAuth } from '../auth/AuthProvider'

export function AppShell() {
  const { user } = useAuth()

  return (
    <div className="appShell">
      <header className="appHeader">
        <Link className="brand" to="/">
          Sakana
        </Link>
        <nav className="nav">
          <Link to="/posts">投稿一覧</Link>
          <Link to="/posts/new">投稿する</Link>
          {user ? <Link to="/me">マイページ</Link> : <Link to="/login">ログイン</Link>}
        </nav>
      </header>
      <main className="appMain">
        <Outlet />
      </main>
    </div>
  )
}

