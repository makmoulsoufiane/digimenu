import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ConfirmDialog from '../../shared/components/ConfirmDialog'
import Icon from '../../shared/components/Icon'
import { ROUTES } from '../../shared/constants/routes'
import MenuCard from './components/MenuCard'
import MenuFormModal from './components/MenuFormModal'
import MenuItemFormModal from './components/MenuItemFormModal'
import MenuItemsTable from './components/MenuItemsTable'
import useMenuManagement from './hooks/useMenuManagement'

function MenuPage() {
  const { menuId } = useParams()
  const navigate = useNavigate()
  const selectedMenuId = menuId ? Number(menuId) : null
  const menuManager = useMenuManagement(selectedMenuId)
  const [menuForm, setMenuForm] = useState(null)
  const [itemForm, setItemForm] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  function selectMenu(id) {
    menuManager.resetFilters()
    navigate(ROUTES.menuDetails(id))
  }

  async function saveMenu(menuData) {
    try {
      if (menuForm.mode === 'edit') {
        await menuManager.updateMenu(menuForm.menu.id, menuData)
      } else {
        const createdMenu = await menuManager.createMenu(menuData)
        selectMenu(createdMenu.id)
      }

      setMenuForm(null)
    } catch (error) {
      window.alert(error.message)
    }
  }

  async function saveItem(itemData) {
    try {
      const savedMenuId =
        itemForm.mode === 'edit'
          ? await menuManager.updateItem(itemForm.item.id, itemData)
          : await menuManager.createItem(itemData)

      if (savedMenuId !== selectedMenuId) {
        selectMenu(savedMenuId)
      }

      setItemForm(null)
    } catch (error) {
      window.alert(error.message)
    }
  }

  async function confirmDelete() {
    try {
      if (deleteTarget.type === 'menu') {
        const deletingSelectedMenu = deleteTarget.record.id === selectedMenuId
        await menuManager.deleteMenu(deleteTarget.record.id)
        if (deletingSelectedMenu) navigate(ROUTES.menus)
      } else {
        await menuManager.deleteItem(deleteTarget.record.id)
      }

      setDeleteTarget(null)
    } catch (error) {
      window.alert(error.message)
    }
  }

  const deleteDescription =
    deleteTarget?.type === 'menu'
      ? `This will permanently remove "${deleteTarget.record.name}" and all of its menu items.`
      : `This will permanently remove "${deleteTarget?.record.name}" from the menu.`

  return (
    <>
      <section className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-[#24718a]">
            Restaurant catalog
          </p>
          <h1 className="text-2xl font-bold tracking-tight sm:text-[30px]">
            Menu Management
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#62757d]">
            Create and organize your restaurant offerings across different
            service times.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setMenuForm({ mode: 'create', menu: null })}
          className="inline-flex h-11 items-center justify-center gap-2 self-start rounded-lg bg-[#154f65] px-5 text-sm font-bold text-white shadow-sm transition hover:bg-[#0f4154]"
        >
          <Icon name="plus" size={17} />
          Add new menu
        </button>
      </section>

      {menuManager.isLoading ? (
        <section className="mt-7 rounded-xl border border-[#dbe3e6] bg-white px-6 py-12 text-center">
          <p className="font-bold text-[#30464e]">Loading menus...</p>
        </section>
      ) : null}

      {menuManager.error ? (
        <section className="mt-7 rounded-xl border border-[#f0c5c5] bg-[#fff7f7] px-6 py-4 text-sm font-semibold text-[#9c3b3b]">
          {menuManager.error}
        </section>
      ) : null}

      <section
        className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
        aria-label="Restaurant menus"
      >
        {menuManager.menus.map((menu) => (
          <MenuCard
            key={menu.id}
            menu={menu}
            itemCount={menuManager.itemCounts[menu.id] ?? 0}
            isSelected={menu.id === menuManager.selectedMenu?.id}
            onSelect={() => selectMenu(menu.id)}
            onEdit={() => setMenuForm({ mode: 'edit', menu })}
            onDelete={() => setDeleteTarget({ type: 'menu', record: menu })}
          />
        ))}
      </section>

      {menuId && !menuManager.isLoading && !menuManager.selectedMenu ? (
        <section className="mt-7 rounded-xl border border-dashed border-[#cbd7db] bg-white px-6 py-16 text-center">
          <h2 className="font-bold text-[#263940]">Menu not found</h2>
          <p className="mt-2 text-sm text-[#718087]">
            Select one of the available menus above.
          </p>
        </section>
      ) : null}

      {menuManager.selectedMenu ? (
        <section className="mt-7 overflow-hidden rounded-xl border border-[#dbe3e6] bg-white shadow-[0_1px_2px_rgba(16,45,55,0.03)]">
          <div className="flex flex-col gap-4 border-b border-[#e1e7e9] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <h2 className="text-lg font-bold">
                {menuManager.selectedMenu.name} items
              </h2>
              <p className="mt-1 text-xs text-[#6b7c83]">
                Managing {menuManager.selectedMenuItems.length} products in this
                menu
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() =>
                  menuManager.setAvailableOnly(!menuManager.availableOnly)
                }
                className={`inline-flex h-9 items-center gap-2 rounded-lg border px-3 text-xs font-bold transition ${
                  menuManager.availableOnly
                    ? 'border-[#1b6079] bg-[#eef7f9] text-[#154f65]'
                    : 'border-[#d9e2e5] bg-white text-[#52676f] hover:bg-[#f7f9fa]'
                }`}
                aria-pressed={menuManager.availableOnly}
              >
                <Icon name="filter" size={14} />
                Available only
              </button>
              <button
                type="button"
                onClick={() => setItemForm({ mode: 'create', item: null })}
                className="inline-flex h-9 items-center gap-2 rounded-lg bg-[#1b6079] px-3.5 text-xs font-bold text-white hover:bg-[#154f65]"
              >
                <Icon name="plus" size={14} />
                Add item
              </button>
            </div>
          </div>

          <div className="border-b border-[#e1e7e9] p-4 sm:px-6">
            <label className="relative block max-w-[440px]">
              <Icon
                name="search"
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7c9098]"
              />
              <input
                type="search"
                value={menuManager.query}
                onChange={(event) => menuManager.setQuery(event.target.value)}
                placeholder="Search this menu..."
                className="h-10 w-full rounded-lg border border-[#d9e2e5] bg-[#f8fafb] pl-10 pr-4 text-sm outline-none transition focus:border-[#1b6079] focus:ring-2 focus:ring-[#1b6079]/10"
              />
            </label>
          </div>

          <MenuItemsTable
            items={menuManager.visibleItems}
            onToggleAvailability={menuManager.toggleItemAvailability}
            onEdit={(item) => setItemForm({ mode: 'edit', item })}
            onDelete={(item) =>
              setDeleteTarget({ type: 'item', record: item })
            }
          />
        </section>
      ) : null}

      {!menuId && !menuManager.isLoading && menuManager.menus.length > 0 ? (
        <section className="mt-7 rounded-xl border border-dashed border-[#cbd7db] bg-white px-6 py-12 text-center">
          <h2 className="font-bold text-[#263940]">Select a menu</h2>
          <p className="mt-2 text-sm text-[#718087]">
            Choose a menu above to view and manage its items.
          </p>
        </section>
      ) : null}

      {!menuManager.isLoading && menuManager.menus.length === 0 ? (
        <section className="mt-7 rounded-xl border border-dashed border-[#cbd7db] bg-white px-6 py-16 text-center">
          <h2 className="font-bold text-[#263940]">No menus yet</h2>
          <p className="mt-2 text-sm text-[#718087]">
            Create a menu to start organizing your products.
          </p>
        </section>
      ) : null}

      {menuForm && (
        <MenuFormModal
          key={`${menuForm.mode}-${menuForm.menu?.id ?? 'new'}`}
          mode={menuForm.mode}
          initialMenu={menuForm.menu}
          existingNames={menuManager.menus
            .filter((menu) => menu.id !== menuForm.menu?.id)
            .map((menu) => menu.name)}
          onClose={() => setMenuForm(null)}
          onSubmit={saveMenu}
        />
      )}

      {itemForm && (
        <MenuItemFormModal
          key={`${itemForm.mode}-${itemForm.item?.id ?? 'new'}`}
          mode={itemForm.mode}
          initialItem={itemForm.item}
          menus={menuManager.menus}
          selectedMenuId={menuManager.selectedMenu?.id}
          itemNamesByMenu={Object.fromEntries(
            Object.entries(menuManager.itemNamesByMenu).map(
              ([currentMenuId, names]) => [
                currentMenuId,
                Number(currentMenuId) === itemForm.item?.menuId
                  ? names.filter((name) => name !== itemForm.item?.name)
                  : names,
              ],
            ),
          )}
          onClose={() => setItemForm(null)}
          onSubmit={saveItem}
        />
      )}

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title={`Delete ${deleteTarget?.type ?? ''}?`}
        description={deleteDescription}
        confirmLabel="Delete"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </>
  )
}

export default MenuPage
