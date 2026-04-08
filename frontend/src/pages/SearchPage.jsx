import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { searchPosts } from '../api/posts'
import { PostCard } from '../components/PostCard'

export function SearchPage() {
  const [params, setParams] = useSearchParams()
  const q = params.get('q') ?? ''
  const [input, setInput] = useState(q)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    setInput(q)
  }, [q])

  useEffect(() => {
    const controller = new AbortController()
    async function load() {
      if (!q) {
        setPosts([])
        return
      }
      setLoading(true)
      setError(null)
      try {
        const data = await searchPosts({ q, limit: 20 })
        if (!Array.isArray(data)) throw new Error('Unexpected response shape')
        setPosts(data)
      } catch (e) {
        if (e?.name !== 'AbortError') setError(e instanceof Error ? e : new Error('Failed to load'))
      } finally {
        setLoading(false)
      }
    }
    load()
    return () => controller.abort()
  }, [q])

  const content = useMemo(() => {
    if (!q) return <div className="state">キーワードを入力してください</div>
    if (loading) return <div className="state">検索中…</div>
    if (error) return <div className="state state-error">検索に失敗しました（{error.message}）</div>
    if (posts.length === 0) return <div className="state">該当する投稿がありません</div>
    return (
      <div className="postList">
        {posts.map((p) => (
          <PostCard key={p.postId ?? `${p.title}-${p.author}`} post={p} />
        ))}
      </div>
    )
  }, [error, loading, posts, q])

  return (
    <div className="page">
      <h1 className="pageTitle">検索</h1>
      <form
        className="searchForm"
        onSubmit={(e) => {
          e.preventDefault()
          const next = input.trim()
          setParams(next ? { q: next } : {})
        }}
      >
        <input
          className="textInput"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="例: アジ / 場所 / タイトル"
        />
        <button className="primaryButton" type="submit">
          検索
        </button>
      </form>
      {content}
    </div>
  )
}

