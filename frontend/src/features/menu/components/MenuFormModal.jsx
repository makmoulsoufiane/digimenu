import { useRef, useState } from 'react'
import { WEEK_DAYS } from '../data/menuData'
import useModalBehavior from '../../../shared/hooks/useModalBehavior'
import Icon from '../../../shared/components/Icon'

function getInitialForm(menu) {
  return {
    name: menu?.name ?? '',
    description: menu?.description ?? '',
    startTime: menu?.startTime ?? '',
    endTime: menu?.endTime ?? '',
    days: menu?.days ?? [],
    imageUrl: menu?.imageUrl ?? '',
  }
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

function MenuFormModal({
  mode,
  initialMenu,
  existingNames,
  onClose,
  onSubmit,
}) {
  const [form, setForm] = useState(() => getInitialForm(initialMenu))
  const [error, setError] = useState(null)
  const nameInputRef = useRef(null)
  const isEditing = mode === 'edit'
  const dialogRef = useModalBehavior({
    onClose,
    initialFocusRef: nameInputRef,
  })

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
    setError(null)
  }

  function handleImageChange(file) {
    if (!file) return

    if (file.size > 2 * 1024 * 1024) {
      setError('Menu image must be smaller than 2 MB.')
      return
    }

    const reader = new FileReader()
    reader.onload = () => updateField('imageUrl', String(reader.result))
    reader.readAsDataURL(file)
  }

  function toggleDay(day) {
    setForm((current) => ({
      ...current,
      days: current.days.includes(day)
        ? current.days.filter((value) => value !== day)
        : [...current.days, day],
    }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    const name = form.name.trim()

    if (!name) {
      setError('Menu name is required.')
      nameInputRef.current?.focus()
      return
    }

    if (
      existingNames.some(
        (value) => value.toLowerCase() === name.toLowerCase(),
      )
    ) {
      setError('A menu with this name already exists.')
      nameInputRef.current?.focus()
      return
    }

    if (Boolean(form.startTime) !== Boolean(form.endTime)) {
      setError('Choose both a start time and an end time.')
      return
    }

    if (form.startTime && form.startTime >= form.endTime) {
      setError('End time must be later than start time.')
      return
    }

    onSubmit({
      ...form,
      name,
      description: form.description.trim(),
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
        aria-labelledby="menu-form-title"
        className="my-auto w-full max-w-[520px] rounded-2xl bg-white shadow-[0_24px_70px_rgba(5,20,26,0.28)]"
      >
        <header className="flex items-start justify-between border-b border-[#e8edef] px-6 py-5 sm:px-7">
          <div>
            <h2 id="menu-form-title" className="text-xl font-bold">
              {isEditing ? 'Edit menu' : 'Create new menu'}
            </h2>
            <p className="mt-1.5 text-sm text-[#718087]">
              {isEditing
                ? "Update this menu's details and availability."
                : 'Add menu details now. Products can be added afterward.'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-lg text-[#697b82] hover:bg-[#f1f5f6]"
            aria-label="Close menu form"
          >
            <Icon name="close" size={19} />
          </button>
        </header>

        <form onSubmit={handleSubmit} noValidate>
          <div className="max-h-[calc(100vh-190px)] space-y-5 overflow-y-auto px-6 py-5 sm:px-7">
            <Field label="Menu image">
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={(event) =>
                  handleImageChange(event.target.files?.[0] ?? null)
                }
                className="block w-full rounded-lg border border-[#d8e1e4] text-sm text-[#6e7f86] file:mr-4 file:h-11 file:border-0 file:border-r file:border-[#d8e1e4] file:bg-[#f5f8f9] file:px-4 file:font-semibold"
              />
              {form.imageUrl && (
                <img
                  src={form.imageUrl}
                  alt="Menu preview"
                  className="mt-3 h-24 w-full rounded-lg object-cover"
                />
              )}
            </Field>

            <Field label="Menu name">
              <input
                ref={nameInputRef}
                value={form.name}
                onChange={(event) => updateField('name', event.target.value)}
                placeholder="e.g. Lunch special"
                maxLength={80}
                aria-invalid={Boolean(error)}
                className={inputClass}
              />
            </Field>

            <Field label="Description">
              <textarea
                value={form.description}
                onChange={(event) =>
                  updateField('description', event.target.value)
                }
                placeholder="Describe your menu..."
                maxLength={240}
                rows={3}
                className="w-full resize-none rounded-lg border border-[#d8e1e4] px-3.5 py-3 text-sm outline-none focus:border-[#1b6079] focus:ring-2 focus:ring-[#1b6079]/10"
              />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Start time">
                <input
                  type="time"
                  value={form.startTime}
                  onChange={(event) =>
                    updateField('startTime', event.target.value)
                  }
                  className={inputClass}
                />
              </Field>
              <Field label="End time">
                <input
                  type="time"
                  value={form.endTime}
                  onChange={(event) =>
                    updateField('endTime', event.target.value)
                  }
                  className={inputClass}
                />
              </Field>
            </div>

            <fieldset>
              <legend className="mb-3 text-sm font-semibold">
                Available days
              </legend>
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                {WEEK_DAYS.map((day) => (
                  <label key={day} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={form.days.includes(day)}
                      onChange={() => toggleDay(day)}
                      className="h-4 w-4 accent-[#1b6079]"
                    />
                    {day}
                  </label>
                ))}
              </div>
            </fieldset>

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
              {isEditing ? 'Save changes' : 'Create menu'}
            </button>
          </footer>
        </form>
      </section>
    </div>
  )
}

export default MenuFormModal
