import { useEffect, useMemo, useRef, useState } from 'react'
import { pagePosts } from '../api/posts'
import { PostCard } from '../components/PostCard'
import { facetFish, facetLocations } from '../api/facets'

export function PostsPage() {
  // default search (title or fish keyword)
  const [keywordInput, setKeywordInput] = useState('')
  const [keyword, setKeyword] = useState('')

  // advanced search (exact fish/location)
  const [advancedOpen, setAdvancedOpen] = useState(false)
  const [fishInput, setFishInput] = useState('')
  const [locationInput, setLocationInput] = useState('')
  const [fish, setFish] = useState('')
  const [location, setLocation] = useState('')

  const [fishSuggestions, setFishSuggestions] = useState([])
  const [locationSuggestions, setLocationSuggestions] = useState([])
  const fishTimer = useRef(null)
  const locTimer = useRef(null)

  const [posts, setPosts] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(0)
  const [size, setSize] = useState(10)
  const [sort, setSort] = useState('latest')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // initial suggestions
    facetFish({ limit: 5 })
      .then((xs) => setFishSuggestions(Array.isArray(xs) ? xs : []))
      .catch(() => setFishSuggestions([]))
    facetLocations({ limit: 5 })
      .then((xs) => setLocationSuggestions(Array.isArray(xs) ? xs : []))
      .catch(() => setLocationSuggestions([]))
  }, [])

  useEffect(() => {
    if (!advancedOpen) return
    if (fishTimer.current) clearTimeout(fishTimer.current)
    fishTimer.current = setTimeout(() => {
      facetFish({ q: fishInput.trim() || undefined, limit: 20 })
        .then((xs) => setFishSuggestions(Array.isArray(xs) ? xs : []))
        .catch(() => setFishSuggestions([]))
    }, 150)
    return () => {
      if (fishTimer.current) clearTimeout(fishTimer.current)
    }
  }, [advancedOpen, fishInput])

  useEffect(() => {
    if (!advancedOpen) return
    if (locTimer.current) clearTimeout(locTimer.current)
    locTimer.current = setTimeout(() => {
      facetLocations({ q: locationInput.trim() || undefined, limit: 20 })
        .then((xs) => setLocationSuggestions(Array.isArray(xs) ? xs : []))
        .catch(() => setLocationSuggestions([]))
    }, 150)
    return () => {
      if (locTimer.current) clearTimeout(locTimer.current)
    }
  }, [advancedOpen, locationInput])

  useEffect(() => {
    const controller = new AbortController()

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const data = await pagePosts({
          q: keyword.trim() || undefined,
          fish: fish.trim() || undefined,
          location: location.trim() || undefined,
          page,
          size,
          sort,
        })
        // backend再起動前などで旧レスポンス(配列)が返る場合も許容する
        if (Array.isArray(data)) {
          setPosts(data)
          setTotal(data.length)
          return
        }
        if (!data || typeof data !== 'object') throw new Error('Unexpected response shape')
        if (!Array.isArray(data.items)) throw new Error('Unexpected response shape')
        setPosts(data.items)
        setTotal(Number.isFinite(data.total) ? data.total : 0)
      } catch (e) {
        if (e?.name !== 'AbortError') setError(e instanceof Error ? e : new Error('Failed to load'))
      } finally {
        setLoading(false)
      }
    }

    load()
    return () => controller.abort()
  }, [fish, keyword, location, page, size, sort])

  useEffect(() => {
    setPage(0)
  }, [fish, keyword, location, size, sort])

  const maxPage = useMemo(() => {
    const pages = Math.ceil((total || 0) / (size || 10))
    return Math.max(0, pages - 1)
  }, [size, total])

  const totalPages = maxPage + 1

  const canPrev = page > 0
  const canNext = page < maxPage

  const pager = (
    <div className="pager">
      <div className="pageSize">
        {[10, 20, 30].map((n) => (
          <button
            key={n}
            type="button"
            className={n === size ? 'chip chipActive' : 'chip'}
            onClick={() => setSize(n)}
          >
            {n}
          </button>
        ))}
      </div>
      <div className="pageNav">
        <button type="button" className="chip" disabled={!canPrev} onClick={() => setPage((p) => Math.max(0, p - 1))}>
          前へ
        </button>
        <div className="pageInfo">
          {totalPages ? `${page + 1}/${totalPages}` : ''}
        </div>
        <button
          type="button"
          className="chip"
          disabled={!canNext}
          onClick={() => setPage((p) => Math.min(maxPage, p + 1))}
        >
          次へ
        </button>
      </div>
    </div>
  )

  const content = useMemo(() => {
    if (loading) return <div className="state">読み込み中…</div>
    if (error) return <div className="state state-error">取得に失敗しました（{error.message}）</div>
    if (posts.length === 0) return <div className="state">投稿がまだありません</div>
    return (
      <div className="postGrid">
        {posts.map((p) => (
          <PostCard key={p.postId ?? `${p.title}-${p.author}`} post={p} />
        ))}
      </div>
    )
  }, [error, loading, posts])

  return (
    <div className="page">
      <h1 className="pageTitle">投稿一覧</h1>
      <form
        className="postsSearch"
        onSubmit={(e) => {
          e.preventDefault()
          setKeyword(keywordInput)
          setFish('')
          setLocation('')
          setFishInput('')
          setLocationInput('')
        }}
      >
        <input
          className="textInput"
          value={keywordInput}
          onChange={(e) => setKeywordInput(e.target.value)}
          placeholder="タイトル or 魚で検索"
        />
        <button className="primaryButton" type="submit">
          検索
        </button>
        <button
          className="secondaryButton"
          type="button"
          onClick={() => setAdvancedOpen((v) => !v)}
        >
          詳細検索
        </button>
      </form>

      {advancedOpen ? (
        <div className="advancedPanel">
          <form
            className="advancedForm"
            onSubmit={(e) => {
              e.preventDefault()
              // keyword search is separate; advanced runs when fish/location is set
              setKeyword('')
              setKeywordInput('')
              setFish(fishInput.trim())
              setLocation(locationInput.trim())
            }}
          >
            <div className="advancedSection">
              <div className="advancedTitle">魚から検索する</div>
              <input
                className="textInput"
                value={fishInput}
                onChange={(e) => setFishInput(e.target.value)}
                placeholder="魚名で絞り込み（入力すると候補が絞られます）"
              />
              <div className="tagSuggest">
                {fishSuggestions.map((name) => (
                  <button
                    key={name}
                    type="button"
                    className={name === fishInput ? 'chip chipActive' : 'chip'}
                    onClick={() => setFishInput(name)}
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>

            <div className="advancedSection">
              <div className="advancedTitle">場所から検索する</div>
              <input
                className="textInput"
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                placeholder="場所で絞り込み（入力すると候補が絞られます）"
              />
              <div className="tagSuggest">
                {locationSuggestions.map((name) => (
                  <button
                    key={name}
                    type="button"
                    className={name === locationInput ? 'chip chipActive' : 'chip'}
                    onClick={() => setLocationInput(name)}
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>

            <div className="advancedActions">
              <button className="primaryButton" type="submit">
                検索
              </button>
              <button
                className="secondaryButton"
                type="button"
                onClick={() => {
                  setFishInput('')
                  setLocationInput('')
                  setFish('')
                  setLocation('')
                }}
              >
                クリア
              </button>
            </div>
          </form>
        </div>
      ) : null}

      <div className="listControls">
        {pager}
        <div className="sortBox">
          <select className="select" value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="latest">最新順</option>
            <option value="oldest">古い順</option>
          </select>
        </div>
      </div>
      {content}
      <div className="pagerBottom">
        <div className="listControls">{pager}</div>
      </div>
    </div>
  )
}

