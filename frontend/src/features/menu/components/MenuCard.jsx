import Icon from '../../../shared/components/Icon'
import { formatMenuSchedule } from '../utils/menuUtils'

function MenuCard({
  menu,
  itemCount,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
}) {
  return (
    <article
      className={`rounded-xl border bg-white p-4 shadow-[0_1px_3px_rgba(22,55,65,0.04)] transition ${
        isSelected
          ? 'border-[#1b6079] ring-2 ring-[#1b6079]/10'
          : 'border-[#dbe3e6] hover:border-[#aebfc5]'
      }`}
    >
      <button
        type="button"
        onClick={onSelect}
        className="w-full text-left"
        aria-pressed={isSelected}
      >
        <div className="flex items-start justify-between gap-3">
          {menu.imageUrl ? (
            <img
              src={menu.imageUrl}
              alt=""
              className="h-10 w-10 rounded-lg object-cover ring-1 ring-black/5"
            />
          ) : (
            <span
              className={`grid h-10 w-10 place-items-center rounded-lg ${
                isSelected
                  ? 'bg-[#154f65] text-white'
                  : 'bg-[#edf5f7] text-[#1b6079]'
              }`}
            >
              <Icon name={menu.icon} size={19} />
            </span>
          )}
          <span
            className={`rounded-md px-2 py-1 text-[9px] font-bold uppercase tracking-wide ${
              menu.status === 'active'
                ? 'bg-[#ecf9ef] text-[#218346]'
                : 'bg-[#f0f2f3] text-[#77858b]'
            }`}
          >
            {menu.status}
          </span>
        </div>

        <h2 className="mt-4 text-base font-bold">{menu.name}</h2>
        <p className="mt-1 text-xs text-[#6a7b82]">
          {itemCount} {itemCount === 1 ? 'item' : 'items'} ·{' '}
          {formatMenuSchedule(menu)}
        </p>
      </button>

      <div className="mt-4 flex items-center gap-3 border-t border-[#edf0f1] pt-3 text-[11px] font-bold">
        <button
          type="button"
          onClick={onEdit}
          className="text-[#2c677c] hover:text-[#164d61]"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="text-[#b44646] hover:text-[#8c2929]"
        >
          Delete
        </button>
        <button
          type="button"
          onClick={onSelect}
          className="ml-auto text-[#809096] hover:text-[#154f65]"
          aria-label={`Open ${menu.name} menu`}
        >
          {isSelected ? (
            <span className="grid h-5 w-5 place-items-center rounded-full border border-[#1b6079] text-[#1b6079]">
              <Icon name="check" size={12} />
            </span>
          ) : (
            <Icon name="chevron" size={16} />
          )}
        </button>
      </div>
    </article>
  )
}

export default MenuCard
