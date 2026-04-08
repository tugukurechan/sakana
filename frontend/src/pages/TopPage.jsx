import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { getTopPosts } from '../api/posts'
import { PostCard } from '../components/PostCard'

export function TopPage() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const controller = new AbortController()

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const data = await getTopPosts()
        if (!Array.isArray(data)) throw new Error('Unexpected response shape')
        setPosts(data)
      } catch (e) {
        if (e?.name !== 'AbortError') {
          setError(e instanceof Error ? e : new Error('Failed to load'))
        }
      } finally {
        setLoading(false)
      }
    }

    load()
    return () => controller.abort()
  }, [])

  const content = useMemo(() => {
    if (loading) return <div className="state">読み込み中…</div>
    if (error) return <div className="state state-error">取得に失敗しました（{error.message}）</div>
    if (posts.length === 0) return <div className="state">投稿がまだありません</div>
    return (
      <div className="postList">
        {posts.slice(0, 3).map((p) => (
          <PostCard key={p.postId ?? `${p.title}-${p.author}`} post={p} />
        ))}
      </div>
    )
  }, [error, loading, posts])

  return (
    <div className="top">
      <header className="topHeader">
        <h1 className="topTitle">Sakana</h1>
        <div className="topSubtitle">最新の投稿</div>
      </header>

      {content}

      <div className="topActions">
        <div className="buttonRow">
          <Link className="secondaryButton" to="/posts">
            他の投稿も観る
          </Link>
          <Link className="primaryButton" to="/posts/new">
            投稿する
          </Link>
        </div>
      </div>
    </div>
  )
}

