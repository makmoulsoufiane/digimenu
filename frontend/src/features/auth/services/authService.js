import { apiRequest } from '../../../shared/services/apiClient'

export async function login({ email, password, remember }) {
  const data = await apiRequest('/login', {
    method: 'POST',
    body: JSON.stringify({ email, password, remember }),
  })

  return data.user
}

export async function getAuthenticatedUser() {
  const data = await apiRequest('/user')

  return data.user
}

export function logout() {
  return apiRequest('/logout', {
    method: 'POST',
  })
}
