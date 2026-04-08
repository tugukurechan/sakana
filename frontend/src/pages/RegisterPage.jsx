import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import * as authApi from '../api/auth'
import { useAuth } from '../auth/AuthProvider'

export function RegisterPage() {
  const navigate = useNavigate()
  const { refresh } = useAuth()

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const disabled = useMemo(() => submitting || !username || !password, [password, submitting, username])

  return (
    <div className="page">
      <h1 className="pageTitle">新規登録</h1>

      <form
        className="form"
        onSubmit={async (e) => {
          e.preventDefault()
          setSubmitting(true)
          setError(null)
          try {
            await authApi.register({ username, email, password, displayName })
            await authApi.login({ username, password })
            await refresh()
            navigate('/', { replace: true })
          } catch (e) {
            setError(e instanceof Error ? e : new Error('登録に失敗しました'))
          } finally {
            setSubmitting(false)
          }
        }}
      >
        <label className="field">
          <div className="label">ユーザー名（必須）</div>
          <input className="textInput" value={username} onChange={(e) => setUsername(e.target.value)} />
        </label>
        <label className="field">
          <div className="label">表示名</div>
          <input className="textInput" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
        </label>
        <label className="field">
          <div className="label">メール</div>
          <input className="textInput" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label className="field">
          <div className="label">パスワード（必須）</div>
          <input
            className="textInput"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        {error ? <div className="state state-error">{error.message}</div> : null}
        <button className="primaryButton" type="submit" disabled={disabled}>
          {submitting ? '送信中…' : '登録する'}
        </button>
      </form>

      <div className="helper">
        すでにアカウントがある場合は <Link to="/login">ログイン</Link>
      </div>
    </div>
  )
}

