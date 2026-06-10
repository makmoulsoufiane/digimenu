import Icon from './Icon'

function AvailabilityToggle({ checked, itemName, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={`Set ${itemName} as ${checked ? 'unavailable' : 'available'}`}
      onClick={onChange}
      className={`relative h-6 w-11 rounded-full transition ${
        checked ? 'bg-[#1b6079]' : 'bg-[#c9d3d6]'
      }`}
    >
      <span
        className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
          checked ? 'left-6' : 'left-1'
        }`}
      />
    </button>
  )
}

function ItemActions({ item, onEdit, onDelete }) {
  return (
    <div className="flex items-center justify-end gap-1">
      <button
        type="button"
        onClick={() => onEdit(item)}
        className="grid h-9 w-9 place-items-center rounded-lg text-[#516970] hover:bg-[#eef4f5] hover:text-[#154f65]"
        aria-label={`Edit ${item.name}`}
      >
        <Icon name="edit" size={15} />
      </button>
      <button
        type="button"
        onClick={() => onDelete(item)}
        className="grid h-9 w-9 place-items-center rounded-lg text-[#718187] hover:bg-[#fff0f0] hover:text-[#b13c3c]"
        aria-label={`Delete ${item.name}`}
      >
        <Icon name="trash" size={15} />
      </button>
    </div>
  )
}

function ItemImage({ item, className }) {
  if (item.image) {
    return <img src={item.image} alt="" className={className} />
  }

  return (
    <span
      className={`${className} grid place-items-center bg-[#edf3f5] text-[#1b6079]`}
    >
      <Icon name="utensils" size={18} />
    </span>
  )
}

function MenuItemsTable({
  items,
  onToggleAvailability,
  onEdit,
  onDelete,
}) {
  if (items.length === 0) {
    return (
      <div className="grid min-h-56 place-items-center px-6 text-center">
        <div>
          <p className="font-bold text-[#30464e]">No menu items found</p>
          <p className="mt-1 text-sm text-[#74858c]">
            Try changing your search or availability filter.
          </p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[820px] text-left">
          <thead className="bg-[#f6f8f9]">
            <tr className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#64767d]">
              <th className="px-6 py-3.5">Item</th>
              <th className="px-4 py-3.5">Category</th>
              <th className="px-4 py-3.5">Price</th>
              <th className="px-4 py-3.5">Availability</th>
              <th className="px-6 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e2e8ea]">
            {items.map((item) => (
              <tr key={item.id} className="group hover:bg-[#fbfcfc]">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <ItemImage
                      item={item}
                      className="h-12 w-12 rounded-lg object-cover ring-1 ring-black/5"
                    />
                    <div className="min-w-0">
                      <p className="font-bold text-[#1d2e35]">{item.name}</p>
                      <p className="mt-1 max-w-[310px] truncate text-xs text-[#708188]">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className="rounded-md bg-[#eef1fb] px-2 py-1 text-[9px] font-bold uppercase text-[#57678c]">
                    {item.category}
                  </span>
                </td>
                <td className="px-4 py-4 text-sm font-bold">
                  ${item.price.toFixed(2)}
                </td>
                <td className="px-4 py-4">
                  <AvailabilityToggle
                    checked={item.available}
                    itemName={item.name}
                    onChange={() => onToggleAvailability(item.id)}
                  />
                </td>
                <td className="px-6 py-4">
                  <ItemActions
                    item={item}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="divide-y divide-[#e2e8ea] md:hidden">
        {items.map((item) => (
          <article key={item.id} className="p-4">
            <div className="flex gap-3">
              <ItemImage
                item={item}
                className="h-16 w-16 shrink-0 rounded-lg object-cover"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold">{item.name}</h3>
                    <p className="mt-1 text-sm font-bold text-[#154f65]">
                      ${item.price.toFixed(2)}
                    </p>
                  </div>
                  <AvailabilityToggle
                    checked={item.available}
                    itemName={item.name}
                    onChange={() => onToggleAvailability(item.id)}
                  />
                </div>
                <p className="mt-2 line-clamp-2 text-xs leading-5 text-[#708188]">
                  {item.description}
                </p>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-[#edf0f1] pt-2">
              <span className="rounded-md bg-[#eef1fb] px-2 py-1 text-[9px] font-bold uppercase text-[#57678c]">
                {item.category}
              </span>
              <ItemActions
                item={item}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            </div>
          </article>
        ))}
      </div>

      <footer className="flex items-center justify-between border-t border-[#e2e8ea] px-5 py-4 text-xs text-[#687a81] sm:px-6">
        <p>
          Showing <strong className="text-[#31464e]">{items.length}</strong>{' '}
          items
        </p>
        <p>All items in this menu</p>
      </footer>
    </>
  )
}

export default MenuItemsTable
