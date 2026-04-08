import { apiFetch } from './client'

export function facetFish({ q, limit = 5 } = {}) {
  const params = new URLSearchParams()
  if (q) params.set('q', q)
  if (limit) params.set('limit', String(limit))
  return apiFetch(`/api/facets/fish?${params.toString()}`)
}

export function facetLocations({ q, limit = 5 } = {}) {
  const params = new URLSearchParams()
  if (q) params.set('q', q)
  if (limit) params.set('limit', String(limit))
  return apiFetch(`/api/facets/locations?${params.toString()}`)
}

