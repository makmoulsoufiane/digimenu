import { useState } from 'react'
import ConfirmDialog from '../components/ConfirmDialog'
import Icon from '../components/Icon'
import MenuCard from '../components/MenuCard'
import MenuFormModal from '../components/MenuFormModal'
import MenuItemFormModal from '../components/MenuItemFormModal'
import MenuItemsTable from '../components/MenuItemsTable'
import Sidebar from '../components/Sidebar'
import useMenuManagement from '../features/menu/hooks/useMenuManagement'

function AdminDashboardPage() {
  const menuManager = useMenuManagement()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [menuForm, setMenuForm] = useState(null)
  const [itemForm, setItemForm] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  function saveMenu(menuData) {
    if (menuForm.mode === 'edit') {
      menuManager.updateMenu(menuForm.menu.id, menuData)
    } else {
      menuManager.createMenu(menuData)
    }

    setMenuForm(null)
  }

  function saveItem(itemData) {
    if (itemForm.mode === 'edit') {
      menuManager.updateItem(itemForm.item.id, itemData)
    } else {
      menuManager.createItem(itemData)
    }

    setItemForm(null)
  }

  function confirmDelete() {
    if (deleteTarget.type === 'menu') {
      menuManager.deleteMenu(deleteTarget.record.id)
    } else {
      menuManager.deleteItem(deleteTarget.record.id)
    }

    setDeleteTarget(null)
  }

  const deleteDescription =
    deleteTarget?.type === 'menu'
      ? `This will permanently remove "${deleteTarget.record.name}" and all of its menu items.`
      : `This will permanently remove "${deleteTarget?.record.name}" from the menu.`

  return (
    <div className="min-h-screen bg-[#f5f7f8] text-[#17242b]">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="min-h-screen lg:pl-[232px]">
        <header className="sticky top-0 z-20 flex h-[72px] items-center gap-4 border-b border-[#dde5e8] bg-white/95 px-5 backdrop-blur sm:px-8">
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-lg border border-[#dce4e7] text-[#36515d] lg:hidden"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open navigation"
          >
            <Icon name="menu" size={20} />
          </button>

          <p className="text-lg font-bold text-[#124b61]">Menus</p>

          <label className="relative ml-auto hidden w-full max-w-[440px] md:block">
            <Icon
              name="search"
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7c9098]"
            />
            <input
              type="search"
              value={menuManager.query}
              onChange={(event) => menuManager.setQuery(event.target.value)}
              placeholder="Search menu items..."
              className="h-10 w-full rounded-lg border border-[#d9e2e5] bg-[#f8fafb] pl-10 pr-4 text-sm outline-none transition focus:border-[#1b6079] focus:ring-2 focus:ring-[#1b6079]/10"
            />
          </label>

          <button
            type="button"
            className="ml-auto grid h-10 w-10 place-items-center rounded-lg text-[#526b75] hover:bg-[#f1f5f6] md:ml-1"
            aria-label="Notifications"
          >
            <Icon name="bell" size={19} />
          </button>
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-lg text-[#526b75] hover:bg-[#f1f5f6]"
            aria-label="Settings"
          >
            <Icon name="settings" size={19} />
          </button>
          <div
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#1b6079] text-sm font-bold text-white"
            aria-label="Manager profile"
          >
            JD
          </div>
        </header>

        <main className="mx-auto max-w-[1320px] px-5 py-7 sm:px-8 sm:py-9">
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
                onSelect={() => menuManager.selectMenu(menu.id)}
                onEdit={() => setMenuForm({ mode: 'edit', menu })}
                onDelete={() =>
                  setDeleteTarget({ type: 'menu', record: menu })
                }
              />
            ))}
          </section>

          {menuManager.selectedMenu ? (
            <section className="mt-7 overflow-hidden rounded-xl border border-[#dbe3e6] bg-white shadow-[0_1px_2px_rgba(16,45,55,0.03)]">
              <div className="flex flex-col gap-4 border-b border-[#e1e7e9] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <div>
                  <h2 className="text-lg font-bold">
                    {menuManager.selectedMenu.name} items
                  </h2>
                  <p className="mt-1 text-xs text-[#6b7c83]">
                    Managing {menuManager.selectedMenuItems.length} products in
                    this menu
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      menuManager.setAvailableOnly(
                        !menuManager.availableOnly,
                      )
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
                    onClick={() =>
                      setItemForm({ mode: 'create', item: null })
                    }
                    className="inline-flex h-9 items-center gap-2 rounded-lg bg-[#1b6079] px-3.5 text-xs font-bold text-white hover:bg-[#154f65]"
                  >
                    <Icon name="plus" size={14} />
                    Add item
                  </button>
                </div>
              </div>

              <div className="border-b border-[#e1e7e9] p-4 md:hidden">
                <label className="relative block">
                  <Icon
                    name="search"
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7c9098]"
                  />
                  <input
                    type="search"
                    value={menuManager.query}
                    onChange={(event) =>
                      menuManager.setQuery(event.target.value)
                    }
                    placeholder="Search this menu..."
                    className="h-10 w-full rounded-lg border border-[#d9e2e5] bg-[#f8fafb] pl-10 pr-4 text-sm outline-none focus:border-[#1b6079]"
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
          ) : (
            <section className="mt-7 rounded-xl border border-dashed border-[#cbd7db] bg-white px-6 py-16 text-center">
              <h2 className="font-bold text-[#263940]">No menus yet</h2>
              <p className="mt-2 text-sm text-[#718087]">
                Create a menu to start organizing your products.
              </p>
            </section>
          )}
        </main>
      </div>

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
              ([menuId, names]) => [
                menuId,
                Number(menuId) === itemForm.item?.menuId
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
    </div>
  )
}

export default AdminDashboardPage
