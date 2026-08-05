const API_ORIGIN = import.meta.env.VITE_API_ORIGIN ?? 'http://localhost:8000'
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? `${API_ORIGIN}/api`
const CSRF_COOKIE_URL =
  import.meta.env.VITE_CSRF_COOKIE_URL ?? `${API_ORIGIN}/sanctum/csrf-cookie`

let csrfCookiePromise = null

function getCookie(name) {
  return document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${name}=`))
    ?.split('=')[1]
}

async function ensureCsrfCookie() {
  csrfCookiePromise ??= fetch(CSRF_COOKIE_URL, {
    credentials: 'include',
  }).finally(() => {
    csrfCookiePromise = null
  })

  const response = await csrfCookiePromise

  if (!response.ok) {
    throw new Error('Could not prepare a secure login request.')
  }
}

async function parseJson(response) {
  return response.json().catch(() => null)
}

export async function apiRequest(path, options = {}) {
  const method = options.method ?? 'GET'
  const shouldUseCsrf = !['GET', 'HEAD', 'OPTIONS'].includes(method)

  if (shouldUseCsrf) {
    await ensureCsrfCookie()
  }

  const xsrfToken = getCookie('XSRF-TOKEN')
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    method,
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(xsrfToken ? { 'X-XSRF-TOKEN': decodeURIComponent(xsrfToken) } : {}),
      ...options.headers,
    },
  })

  if (response.status === 204) return null

  const data = await parseJson(response)

  if (!response.ok) {
    const message =
      data?.message ??
      Object.values(data?.errors ?? {})?.flat()?.[0] ??
      'The request failed.'

    throw new Error(message)
  }

  return data
}
