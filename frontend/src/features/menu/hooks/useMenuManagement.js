import { useMemo, useState } from 'react'
import { initialMenuItems, initialMenus } from '../data/menuData'
import { getNextId, normalizeText } from '../utils/menuUtils'

export default function useMenuManagement() {
  const [menus, setMenus] = useState(initialMenus)
  const [items, setItems] = useState(initialMenuItems)
  const [selectedMenuId, setSelectedMenuId] = useState(initialMenus[1].id)
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

  function resetFilters() {
    setQuery('')
    setAvailableOnly(false)
  }

  function selectMenu(menuId) {
    setSelectedMenuId(menuId)
    resetFilters()
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
    selectMenu(id)
  }

  function updateMenu(menuId, menuData) {
    setMenus((current) =>
      current.map((menu) =>
        menu.id === menuId ? { ...menu, ...menuData } : menu,
      ),
    )
  }

  function deleteMenu(menuId) {
    const remainingMenus = menus.filter((menu) => menu.id !== menuId)

    setMenus(remainingMenus)
    setItems((current) => current.filter((item) => item.menuId !== menuId))

    if (selectedMenuId === menuId) {
      setSelectedMenuId(remainingMenus[0]?.id ?? null)
    }

    resetFilters()
  }

  function createItem(itemData) {
    const id = getNextId(items)
    setItems((current) => [
      ...current,
      { id, menuId: selectedMenuId, ...itemData },
    ])
  }

  function updateItem(itemId, itemData) {
    setItems((current) =>
      current.map((item) =>
        item.id === itemId ? { ...item, ...itemData } : item,
      ),
    )
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
    query,
    availableOnly,
    setQuery,
    setAvailableOnly,
    selectMenu,
    createMenu,
    updateMenu,
    deleteMenu,
    createItem,
    updateItem,
    deleteItem,
    toggleItemAvailability,
  }
}
