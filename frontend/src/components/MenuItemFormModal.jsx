import { useRef, useState } from 'react'
import useModalBehavior from '../hooks/useModalBehavior'
import Icon from './Icon'

const EMPTY_FORM = {
  name: '',
  description: '',
  menuId: '',
  price: '',
  available: true,
  image: '',
}

function getInitialForm(item, selectedMenuId) {
  return item
    ? { ...item, menuId: String(item.menuId), price: String(item.price) }
    : { ...EMPTY_FORM, menuId: String(selectedMenuId ?? '') }
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-[#263940]">
        {label}
      </span>
      {children}
    </label>
  )
}

function MenuItemFormModal({
  mode,
  initialItem,
  menus,
  selectedMenuId,
  itemNamesByMenu,
  onClose,
  onSubmit,
}) {
  const [form, setForm] = useState(() =>
    getInitialForm(initialItem, selectedMenuId),
  )
  const [error, setError] = useState('')
  const nameInputRef = useRef(null)
  const dialogRef = useModalBehavior({
    onClose,
    initialFocusRef: nameInputRef,
  })
  const isEditing = mode === 'edit'

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
    setError('')
  }

  function handleImageChange(file) {
    if (!file) return

    if (file.size > 2 * 1024 * 1024) {
      setError('Product image must be smaller than 2 MB.')
      return
    }

    const reader = new FileReader()
    reader.onload = () => updateField('image', String(reader.result))
    reader.readAsDataURL(file)
  }

  function handleSubmit(event) {
    event.preventDefault()
    const name = form.name.trim()
    const menuId = Number(form.menuId)
    const price = Number(form.price)

    if (!name || !menuId || !form.description.trim()) {
      setError('Name, description, and menu category are required.')
      return
    }

    if (
      (itemNamesByMenu[menuId] ?? []).some(
        (value) => value.toLowerCase() === name.toLowerCase(),
      )
    ) {
      setError('An item with this name already exists in this menu.')
      nameInputRef.current?.focus()
      return
    }

    if (!Number.isFinite(price) || price <= 0) {
      setError('Price must be greater than zero.')
      return
    }

    onSubmit({
      menuId,
      name,
      description: form.description.trim(),
      category: menus.find((menu) => menu.id === menuId)?.name ?? '',
      price,
      available: form.available,
      image: form.image,
    })
  }

  const inputClass =
    'h-11 w-full rounded-lg border border-[#d8e1e4] bg-white px-3.5 text-sm outline-none transition placeholder:text-[#9aa7ac] focus:border-[#1b6079] focus:ring-2 focus:ring-[#1b6079]/10'

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-[#0c1a20]/60 p-4 backdrop-blur-[2px]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <section
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="item-form-title"
        className="my-auto w-full max-w-[520px] rounded-2xl bg-white shadow-[0_24px_70px_rgba(5,20,26,0.28)]"
      >
        <header className="flex items-start justify-between border-b border-[#e8edef] px-6 py-5 sm:px-7">
          <div>
            <h2 id="item-form-title" className="text-xl font-bold">
              {isEditing ? 'Edit menu item' : 'Add menu item'}
            </h2>
            <p className="mt-1.5 text-sm text-[#718087]">
              {isEditing
                ? 'Update the product details for this menu.'
                : 'Add a product to the selected menu.'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-lg text-[#697b82] hover:bg-[#f1f5f6]"
            aria-label="Close item form"
          >
            <Icon name="close" size={19} />
          </button>
        </header>

        <form onSubmit={handleSubmit} noValidate>
          <div className="max-h-[calc(100vh-190px)] space-y-5 overflow-y-auto px-6 py-5 sm:px-7">
            <Field label="Product image">
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={(event) =>
                  handleImageChange(event.target.files?.[0] ?? null)
                }
                className="block w-full rounded-lg border border-[#d8e1e4] text-sm text-[#6e7f86] file:mr-4 file:h-11 file:border-0 file:border-r file:border-[#d8e1e4] file:bg-[#f5f8f9] file:px-4 file:font-semibold"
              />
              {form.image && (
                <img
                  src={form.image}
                  alt="Product preview"
                  className="mt-3 h-28 w-full rounded-lg object-cover"
                />
              )}
            </Field>

            <Field label="Item name">
              <input
                ref={nameInputRef}
                value={form.name}
                onChange={(event) => updateField('name', event.target.value)}
                placeholder="e.g. Grilled chicken"
                maxLength={100}
                className={inputClass}
              />
            </Field>

            <Field label="Description">
              <textarea
                value={form.description}
                onChange={(event) =>
                  updateField('description', event.target.value)
                }
                placeholder="Describe the menu item..."
                maxLength={280}
                rows={3}
                className="w-full resize-none rounded-lg border border-[#d8e1e4] px-3.5 py-3 text-sm outline-none focus:border-[#1b6079] focus:ring-2 focus:ring-[#1b6079]/10"
              />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Menu category">
                <select
                  value={form.menuId}
                  onChange={(event) =>
                    updateField('menuId', event.target.value)
                  }
                  className={inputClass}
                >
                  <option value="" disabled>
                    Select a menu
                  </option>
                  {menus.map((menu) => (
                    <option key={menu.id} value={menu.id}>
                      {menu.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Price">
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={form.price}
                  onChange={(event) => updateField('price', event.target.value)}
                  placeholder="0.00"
                  className={inputClass}
                />
              </Field>
            </div>

            <label className="flex items-center gap-3 text-sm font-semibold">
              <input
                type="checkbox"
                checked={form.available}
                onChange={(event) =>
                  updateField('available', event.target.checked)
                }
                className="h-4 w-4 accent-[#1b6079]"
              />
              Available to customers
            </label>

            {error && (
              <p
                role="alert"
                className="rounded-lg bg-[#fff1f1] px-3.5 py-2.5 text-sm font-medium text-[#a43d3d]"
              >
                {error}
              </p>
            )}
          </div>

          <footer className="flex justify-end gap-3 border-t border-[#e8edef] px-6 py-4 sm:px-7">
            <button
              type="button"
              onClick={onClose}
              className="h-10 rounded-lg border border-[#d7e0e3] px-4 text-sm font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-10 rounded-lg bg-[#154f65] px-5 text-sm font-bold text-white hover:bg-[#0f4154]"
            >
              {isEditing ? 'Save changes' : 'Add item'}
            </button>
          </footer>
        </form>
      </section>
    </div>
  )
}

export default MenuItemFormModal
