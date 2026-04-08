import { apiFetch } from './client'

export function getTopPosts() {
  return apiFetch('/api/top')
}

export function listPosts({ limit = 20, cursor } = {}) {
  const params = new URLSearchParams()
  if (limit) params.set('limit', String(limit))
  if (cursor) params.set('cursor', String(cursor))
  return apiFetch(params.toString() ? `/api/posts?${params.toString()}` : '/api/posts')
}

export function searchPosts({ q, limit = 20 } = {}) {
  const params = new URLSearchParams()
  if (q) params.set('q', q)
  if (limit) params.set('limit', String(limit))
  return apiFetch(params.toString() ? `/api/search?${params.toString()}` : '/api/search')
}

export function filterPosts({ q, fish, location } = {}) {
  const params = new URLSearchParams()
  if (q) params.set('q', q)
  if (fish) params.set('fish', fish)
  if (location) params.set('location', location)
  return apiFetch(params.toString() ? `/api/posts?${params.toString()}` : '/api/posts')
}

export function pagePosts({ q, fish, location, page = 0, size = 10, sort = 'latest' } = {}) {
  const params = new URLSearchParams()
  if (q) params.set('q', q)
  if (fish) params.set('fish', fish)
  if (location) params.set('location', location)
  params.set('page', String(page))
  params.set('size', String(size))
  if (sort) params.set('sort', sort)
  return apiFetch(`/api/posts?${params.toString()}`)
}

export function getPostDetail(postId) {
  return apiFetch(`/api/posts/${encodeURIComponent(postId)}`)
}

export function createPost(payload) {
  return apiFetch('/api/posts', { method: 'POST', json: payload })
}

