import { useMemo, useState } from 'react'
import {
  getInitialMenuItems,
  getInitialMenus,
} from '../services/menuService'
import { getNextId, normalizeText } from '../utils/menuUtils'

export default function useMenuManagement(selectedMenuId) {
  const [menus, setMenus] = useState(getInitialMenus)
  const [items, setItems] = useState(getInitialMenuItems)
  const [query, setQuery] = useState('')
  const [availableOnly, setAvailableOnly] = useState(false)

  const selectedMenu = useMemo(
    () => menus.find((menu) => menu.id === selectedMenuId) ?? null,
    [menus, selectedMenuId],
  )

  const selectedMenuItems = useMemo(
    () => items.filter((item) => item.menuId === selectedMenuId),
    [items, selectedMenuId],
  )

  const visibleItems = useMemo(() => {
    const search = normalizeText(query)

    return selectedMenuItems.filter((item) => {
      const searchableText = `${item.name} ${item.category}`.toLowerCase()
      const matchesSearch = !search || searchableText.includes(search)
      const matchesAvailability = !availableOnly || item.available

      return matchesSearch && matchesAvailability
    })
  }, [availableOnly, query, selectedMenuItems])

  const itemCounts = useMemo(
    () =>
      items.reduce((counts, item) => {
        counts[item.menuId] = (counts[item.menuId] ?? 0) + 1
        return counts
      }, {}),
    [items],
  )

  const itemNamesByMenu = useMemo(
    () =>
      items.reduce((names, item) => {
        names[item.menuId] = [...(names[item.menuId] ?? []), item.name]
        return names
      }, {}),
    [items],
  )

  function resetFilters() {
    setQuery('')
    setAvailableOnly(false)
  }

  function createMenu(menuData) {
    const id = getNextId(menus)
    const menu = {
      id,
      ...menuData,
      status: 'draft',
      icon: 'menus',
    }

    setMenus((current) => [...current, menu])
    return menu
  }

  function updateMenu(menuId, menuData) {
    setMenus((current) =>
      current.map((menu) =>
        menu.id === menuId ? { ...menu, ...menuData } : menu,
      ),
    )
  }

  function deleteMenu(menuId) {
    setMenus((current) => current.filter((menu) => menu.id !== menuId))
    setItems((current) => current.filter((item) => item.menuId !== menuId))
    resetFilters()
  }

  function createItem(itemData) {
    const id = getNextId(items)
    const menuId = itemData.menuId ?? selectedMenuId

    setItems((current) => [
      ...current,
      { id, ...itemData, menuId },
    ])
    return menuId
  }

  function updateItem(itemId, itemData) {
    setItems((current) =>
      current.map((item) =>
        item.id === itemId ? { ...item, ...itemData } : item,
      ),
    )
    return itemData.menuId
  }

  function deleteItem(itemId) {
    setItems((current) => current.filter((item) => item.id !== itemId))
  }

  function toggleItemAvailability(itemId) {
    setItems((current) =>
      current.map((item) =>
        item.id === itemId ? { ...item, available: !item.available } : item,
      ),
    )
  }

  return {
    menus,
    selectedMenu,
    selectedMenuItems,
    visibleItems,
    itemCounts,
    itemNamesByMenu,
    query,
    availableOnly,
    setQuery,
    setAvailableOnly,
    resetFilters,
    createMenu,
    updateMenu,
    deleteMenu,
    createItem,
    updateItem,
    deleteItem,
    toggleItemAvailability,
  }
}
