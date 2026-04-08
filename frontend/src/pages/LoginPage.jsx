import { useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import * as authApi from '../api/auth'
import { useAuth } from '../auth/AuthProvider'

export function LoginPage() {
  const [params] = useSearchParams()
  const returnTo = params.get('returnTo') || '/'
  const navigate = useNavigate()
  const { refresh } = useAuth()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const disabled = useMemo(() => submitting || !username || !password, [password, submitting, username])

  return (
    <div className="page">
      <h1 className="pageTitle">ログイン</h1>

      <form
        className="form"
        onSubmit={async (e) => {
          e.preventDefault()
          setSubmitting(true)
          setError(null)
          try {
            await authApi.login({ username, password })
            await refresh()
            navigate(returnTo, { replace: true })
          } catch (e) {
            setError(e instanceof Error ? e : new Error('ログインに失敗しました'))
          } finally {
            setSubmitting(false)
          }
        }}
      >
        <label className="field">
          <div className="label">ユーザー名</div>
          <input className="textInput" value={username} onChange={(e) => setUsername(e.target.value)} />
        </label>
        <label className="field">
          <div className="label">パスワード</div>
          <input
            className="textInput"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        {error ? <div className="state state-error">{error.message}</div> : null}
        <button className="primaryButton" type="submit" disabled={disabled}>
          {submitting ? '送信中…' : 'ログイン'}
        </button>
      </form>

      <div className="helper">
        アカウントがない場合は <Link to="/register">新規登録</Link>
      </div>
    </div>
  )
}

