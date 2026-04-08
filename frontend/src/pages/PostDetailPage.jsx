import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getPostDetail } from '../api/posts'

function formatDateTime(iso) {
  if (!iso || typeof iso !== 'string') return null
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return null
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hh = String(d.getHours()).padStart(2, '0')
  const mm = String(d.getMinutes()).padStart(2, '0')
  return `${y}-${m}-${day} ${hh}:${mm}`
}

export function PostDetailPage() {
  const { id } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const controller = new AbortController()
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const data = await getPostDetail(id)
        setPost(data)
      } catch (e) {
        if (e?.name !== 'AbortError') setError(e instanceof Error ? e : new Error('Failed to load'))
      } finally {
        setLoading(false)
      }
    }
    if (id) load()
    return () => controller.abort()
  }, [id])

  const content = useMemo(() => {
    if (loading) return <div className="state">読み込み中…</div>
    if (error) return <div className="state state-error">取得に失敗しました（{error.message}）</div>
    if (!post) return <div className="state">投稿が見つかりません</div>

    const createdAt = formatDateTime(post.createdAt)
    const caughtAt = post.caughtAt || null
    const location = post.location || null
    const author = post.author || '匿名'
    const fishNames = Array.isArray(post.fishNames) ? post.fishNames.filter(Boolean) : []
    const images = Array.isArray(post.imageUrls)
      ? post.imageUrls.filter(Boolean)
      : Array.isArray(post.images)
        ? post.images.filter(Boolean)
        : []

    return (
      <div className="postDetail">
        <header className="detailHeader">
          <div className="detailTitleRow">
            <h1 className="detailTitle">{post.title ?? '（無題）'}</h1>
          </div>
          <div className="detailMeta">
            <span>by {author}</span>
            {createdAt ? <span className="detailCreated">{createdAt}</span> : null}
          </div>

          <div className="detailFacts">
            {caughtAt ? (
              <div className="fact">
                <div className="factLabel">釣った日</div>
                <div className="factValue">{caughtAt}</div>
              </div>
            ) : null}
            {location ? (
              <div className="fact">
                <div className="factLabel">場所</div>
                <div className="factValue">{location}</div>
              </div>
            ) : null}
          </div>

          {fishNames.length ? (
            <ul className="tagList" aria-label="fish tags">
              {fishNames.map((name) => (
                <li className="tag" key={name}>
                  {name}
                </li>
              ))}
            </ul>
          ) : null}
        </header>

        {images.length ? (
          <section className="imageStrip" aria-label="post images">
            {images.map((src, idx) => (
              <div className="imageFrame" key={`${src}-${idx}`}>
                <img className="image" src={src} alt="" loading="lazy" />
              </div>
            ))}
          </section>
        ) : null}

        {post.content ? <p className="postContent">{post.content}</p> : null}
      </div>
    )
  }, [error, loading, post])

  return (
    <div className="page">
      {content}
    </div>
  )
}

