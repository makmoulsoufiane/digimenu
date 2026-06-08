import RecentItemsTable from '../components/RecentItemsTable'
import StatCard from '../components/StatCard'

const stats = [
  { label: 'Total Menus', value: 6, accent: 'bg-violet-500' },
  { label: 'Total Menu Items', value: 48, accent: 'bg-blue-500' },
  { label: 'Available Items', value: 41, accent: 'bg-emerald-500' },
  { label: 'Unavailable Items', value: 7, accent: 'bg-rose-500' },
]

const recentItems = [
  {
    id: 1,
    name: 'Truffle Mushroom Pasta',
    menuName: 'Dinner Menu',
    price: 18.5,
    available: true,
  },
  {
    id: 2,
    name: 'Classic Cheeseburger',
    menuName: 'Lunch Menu',
    price: 14,
    available: true,
  },
  {
    id: 3,
    name: 'Berry French Toast',
    menuName: 'Breakfast Menu',
    price: 11.5,
    available: false,
  },
  {
    id: 4,
    name: 'Grilled Salmon',
    menuName: 'Dinner Menu',
    price: 24,
    available: true,
  },
  {
    id: 5,
    name: 'Chocolate Fondant',
    menuName: 'Desserts',
    price: 9,
    available: true,
  },
]

function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <a href="/" className="flex items-center gap-3" aria-label="DigiMenu">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-violet-600 text-lg font-bold text-white">
              D
            </span>
            <div>
              <p className="text-lg font-bold leading-none">DigiMenu</p>
              <p className="mt-1 text-xs text-slate-500">Manager Dashboard</p>
            </div>
          </a>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
            M
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-12">
        <section className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold text-violet-600">OVERVIEW</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Welcome back, Manager
            </h1>
            <p className="mt-3 max-w-2xl text-slate-600">
              Manage your restaurant menus, update menu items, and keep product
              availability accurate.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-400 hover:bg-slate-50">
              Manage Menus
            </button>
            <button className="rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700">
              Manage Menu Items
            </button>
          </div>
        </section>

        <section
          className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
          aria-label="Menu statistics"
        >
          {stats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </section>

        <section className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Recent Menu Items
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                The latest items added across your menus.
              </p>
            </div>
          </div>
          <RecentItemsTable items={recentItems} />
        </section>
      </main>
    </div>
  )
}

export default AdminDashboardPage
