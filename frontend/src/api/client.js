export async function apiFetch(path, { json, headers, ...init } = {}) {
  const res = await fetch(path, {
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      ...(json ? { 'Content-Type': 'application/json' } : null),
      ...(headers ?? null),
    },
    body: json ? JSON.stringify(json) : init.body,
    ...init,
  })

  const contentType = res.headers.get('content-type') || ''
  const isJson = contentType.includes('application/json')
  const data = isJson ? await res.json().catch(() => null) : await res.text().catch(() => null)

  if (!res.ok) {
    const message =
      (data && typeof data === 'object' && 'message' in data && String(data.message)) ||
      (typeof data === 'string' && data) ||
      `HTTP ${res.status}`
    const err = new Error(message)
    err.status = res.status
    err.data = data
    throw err
  }

  return data
}

