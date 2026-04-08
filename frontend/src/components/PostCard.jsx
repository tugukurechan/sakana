import { Link } from 'react-router-dom'

function formatDate(iso) {
  if (!iso || typeof iso !== 'string') return null
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return null
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function PostCard({ post, showLink = true }) {
  const title = post?.title ?? '（無題）'
  const author = post?.author ? `by ${post.author}` : 'by 匿名'
  const created = formatDate(post?.createdAt)
  const fishNames = Array.isArray(post?.fishNames) ? post.fishNames.filter(Boolean) : []

  const body = (
    <article className="postCard">
      <header className="postCardHeader">
        <h2 className="postTitle">{title}</h2>
        <div className="postMeta">
          <span>{author}</span>
          {created ? <span className="postDate">{created}</span> : null}
        </div>
      </header>

      {fishNames.length > 0 ? (
        <ul className="tagList" aria-label="fish tags">
          {fishNames.map((name) => (
            <li className="tag" key={name}>
              {name}
            </li>
          ))}
        </ul>
      ) : (
        <div className="tagListEmpty">魚種タグなし</div>
      )}
    </article>
  )

  if (!showLink || !post?.postId) return body
  return (
    <Link className="cardLink" to={`/posts/${post.postId}`}>
      {body}
    </Link>
  )
}

