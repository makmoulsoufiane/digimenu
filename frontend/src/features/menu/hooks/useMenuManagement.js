import { useEffect, useMemo, useState } from 'react'
import {
  createMenu as createMenuRequest,
  createMenuItem,
  deleteMenu as deleteMenuRequest,
  deleteMenuItem,
  getMenus,
  toggleMenuItemAvailability,
  updateMenu as updateMenuRequest,
  updateMenuItem,
} from '../services/menuService'
import { normalizeText } from '../utils/menuUtils'

export default function useMenuManagement(selectedMenuId) {
  const [menus, setMenus] = useState([])
  const [items, setItems] = useState([])
  const [query, setQuery] = useState('')
  const [availableOnly, setAvailableOnly] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadMenus() {
      try {
        setIsLoading(true)
        setError('')
        const data = await getMenus()

        if (isMounted) {
          setMenus(data.menus)
          setItems(data.items)
        }
      } catch (loadError) {
        if (isMounted) setError(loadError.message)
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    loadMenus()

    return () => {
      isMounted = false
    }
  }, [])

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

  async function createMenu(menuData) {
    const createdMenu = await createMenuRequest(menuData)
    const { items: menuItems = [], ...menu } = createdMenu

    setMenus((current) => [...current, menu])
    setItems((current) => [...current, ...menuItems])
    return menu
  }

  async function updateMenu(menuId, menuData) {
    const updatedMenu = await updateMenuRequest(menuId, menuData)
    const { items: updatedItems = [], ...menu } = updatedMenu

    setMenus((current) =>
      current.map((currentMenu) =>
        currentMenu.id === menuId ? menu : currentMenu,
      ),
    )
    setItems((current) => [
      ...current.filter((item) => item.menuId !== menuId),
      ...updatedItems,
    ])
    return menu
  }

  async function deleteMenu(menuId) {
    await deleteMenuRequest(menuId)
    setMenus((current) => current.filter((menu) => menu.id !== menuId))
    setItems((current) => current.filter((item) => item.menuId !== menuId))
    resetFilters()
  }

  async function createItem(itemData) {
    const createdItem = await createMenuItem({
      ...itemData,
      menuId: itemData.menuId ?? selectedMenuId,
    })

    setItems((current) => [...current, createdItem])
    return createdItem.menuId
  }

  async function updateItem(itemId, itemData) {
    const updatedItem = await updateMenuItem(itemId, itemData)

    setItems((current) =>
      current.map((item) =>
        item.id === itemId ? updatedItem : item,
      ),
    )
    return updatedItem.menuId
  }

  async function deleteItem(itemId) {
    await deleteMenuItem(itemId)
    setItems((current) => current.filter((item) => item.id !== itemId))
  }

  async function toggleItemAvailability(itemId) {
    const updatedItem = await toggleMenuItemAvailability(itemId)

    setItems((current) =>
      current.map((item) =>
        item.id === itemId ? updatedItem : item,
      ),
    )
  }

  return {
    menus,
    isLoading,
    error,
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
