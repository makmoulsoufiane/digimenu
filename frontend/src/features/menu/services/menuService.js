const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api'

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })

  if (response.status === 204) return null

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    const validationMessage = data?.message ?? 'The menu request failed.'
    throw new Error(validationMessage)
  }

  return data
}

export async function getMenus() {
  const data = await request('/menus')
  const menus = data.menus ?? []

  return {
    menus: menus.map((menu) => {
      const menuWithoutItems = { ...menu }
      delete menuWithoutItems.items
      return menuWithoutItems
    }),
    items: menus.flatMap((menu) => menu.items ?? []),
  }
}

export function createMenu(menuData) {
  return request('/menus', {
    method: 'POST',
    body: JSON.stringify(menuData),
  })
}

export function updateMenu(menuId, menuData) {
  return request(`/menus/${menuId}`, {
    method: 'PUT',
    body: JSON.stringify(menuData),
  })
}

export function deleteMenu(menuId) {
  return request(`/menus/${menuId}`, {
    method: 'DELETE',
  })
}

export function createMenuItem(itemData) {
  return request('/menu-items', {
    method: 'POST',
    body: JSON.stringify(itemData),
  })
}

export function updateMenuItem(itemId, itemData) {
  return request(`/menu-items/${itemId}`, {
    method: 'PUT',
    body: JSON.stringify(itemData),
  })
}

export function deleteMenuItem(itemId) {
  return request(`/menu-items/${itemId}`, {
    method: 'DELETE',
  })
}

export function toggleMenuItemAvailability(itemId) {
  return request(`/menu-items/${itemId}/availability`, {
    method: 'PATCH',
  })
}
