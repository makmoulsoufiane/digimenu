import Icon from './Icon'

const navigation = [
  { label: 'Overview', icon: 'dashboard' },
  { label: 'Menus', icon: 'menus', active: true },
]

function SidebarContent({ onClose }) {
  return (
    <div className="flex h-full flex-col bg-[#124b61] text-white">
      <div className="flex h-[72px] items-center justify-between border-b border-white/10 px-6">
        <div>
          <p className="text-lg font-extrabold leading-none">DigiMenu</p>
          <p className="mt-1 text-[10px] font-medium text-[#b8d1da]">
            Management portal
          </p>
        </div>
        <button
          type="button"
          className="grid h-9 w-9 place-items-center rounded-lg text-white/80 hover:bg-white/10 lg:hidden"
          onClick={onClose}
          aria-label="Close navigation"
        >
          <span className="text-2xl font-light">×</span>
        </button>
      </div>

      <nav className="px-3 py-6" aria-label="Main navigation">
        <p className="px-3 text-[9px] font-bold uppercase tracking-[0.18em] text-[#85adbc]">
          Workspace
        </p>
        <ul className="mt-3 space-y-1">
          {navigation.map((item) => (
            <li key={item.label}>
              <a
                href="/"
                className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold transition ${
                  item.active
                    ? 'bg-white/10 text-white shadow-[inset_3px_0_0_#7dd3b0]'
                    : 'text-[#c4d9e0] hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon name={item.icon} size={17} />
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="mx-3 my-6 h-px bg-white/10" />
        <div className="rounded-lg bg-[#0e4053] px-4 py-4">
          <p className="text-xs font-bold">MVP workspace</p>
          <p className="mt-1 text-[11px] leading-5 text-[#a9c5cf]">
            Menu and product management only.
          </p>
        </div>
      </nav>

      <div className="mt-auto border-t border-white/10 p-4">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 text-xs font-bold">
            BL
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-bold">Bistro Lux</p>
            <p className="mt-0.5 text-[10px] text-[#9fbdc8]">Manager account</p>
          </div>
          <button
            type="button"
            className="grid h-9 w-9 place-items-center rounded-lg text-[#b9d0d8] hover:bg-white/10 hover:text-white"
            aria-label="Sign out"
          >
            <Icon name="logout" size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}

function Sidebar({ isOpen, onClose }) {
  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[232px] lg:block">
        <SidebarContent />
      </aside>

      {isOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-[#071a21]/55 backdrop-blur-[2px]"
            onClick={onClose}
            aria-label="Close navigation overlay"
          />
          <aside className="relative h-full w-[280px] shadow-2xl">
            <SidebarContent onClose={onClose} />
          </aside>
        </div>
      )}
    </>
  )
}

export default Sidebar
