import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createPost } from '../api/posts'

export function NewPostPage() {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [fishNamesText, setFishNamesText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const disabled = useMemo(() => submitting || !title || !content, [content, submitting, title])

  return (
    <div className="page">
      <h1 className="pageTitle">新規投稿</h1>

      <form
        className="form"
        onSubmit={async (e) => {
          e.preventDefault()
          setSubmitting(true)
          setError(null)
          try {
            const fishNames = fishNamesText
              .split(',')
              .map((s) => s.trim())
              .filter(Boolean)
            await createPost({ title, content, fishNames })
            navigate('/posts', { replace: true })
          } catch (e) {
            setError(e instanceof Error ? e : new Error('投稿に失敗しました'))
          } finally {
            setSubmitting(false)
          }
        }}
      >
        <label className="field">
          <div className="label">タイトル（必須）</div>
          <input className="textInput" value={title} onChange={(e) => setTitle(e.target.value)} />
        </label>
        <label className="field">
          <div className="label">本文（必須）</div>
          <textarea className="textArea" value={content} onChange={(e) => setContent(e.target.value)} rows={6} />
        </label>
        <label className="field">
          <div className="label">魚種（カンマ区切り）</div>
          <input
            className="textInput"
            value={fishNamesText}
            onChange={(e) => setFishNamesText(e.target.value)}
            placeholder="例: アジ, サバ"
          />
        </label>
        {error ? <div className="state state-error">{error.message}</div> : null}
        <button className="primaryButton" type="submit" disabled={disabled}>
          {submitting ? '送信中…' : '投稿する'}
        </button>
      </form>
    </div>
  )
}

