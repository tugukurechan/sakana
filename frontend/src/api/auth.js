import { apiFetch } from './client'

export function me() {
  return apiFetch('/api/me')
}

export function login({ username, password }) {
  return apiFetch('/api/login', { method: 'POST', json: { username, password } })
}

export function register({ username, email, password, displayName }) {
  return apiFetch('/api/register', {
    method: 'POST',
    json: { username, email, password, displayName },
  })
}

export function logout() {
  return apiFetch('/api/logout', { method: 'POST' })
}

