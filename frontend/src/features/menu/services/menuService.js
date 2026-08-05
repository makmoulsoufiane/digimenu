import { apiRequest } from '../../../shared/services/apiClient'

export async function getMenus() {
  const data = await apiRequest('/menus')
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
  return apiRequest('/menus', {
    method: 'POST',
    body: JSON.stringify(menuData),
  })
}

export function updateMenu(menuId, menuData) {
  return apiRequest(`/menus/${menuId}`, {
    method: 'PUT',
    body: JSON.stringify(menuData),
  })
}

export function deleteMenu(menuId) {
  return apiRequest(`/menus/${menuId}`, {
    method: 'DELETE',
  })
}

export function createMenuItem(itemData) {
  return apiRequest('/menu-items', {
    method: 'POST',
    body: JSON.stringify(itemData),
  })
}

export function updateMenuItem(itemId, itemData) {
  return apiRequest(`/menu-items/${itemId}`, {
    method: 'PUT',
    body: JSON.stringify(itemData),
  })
}

export function deleteMenuItem(itemId) {
  return apiRequest(`/menu-items/${itemId}`, {
    method: 'DELETE',
  })
}

export function toggleMenuItemAvailability(itemId) {
  return apiRequest(`/menu-items/${itemId}/availability`, {
    method: 'PATCH',
  })
}
