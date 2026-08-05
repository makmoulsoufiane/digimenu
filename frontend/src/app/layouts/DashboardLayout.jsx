import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../features/auth/useAuth'
import Icon from '../../shared/components/Icon'
import { ROUTES } from '../../shared/constants/routes'
import Sidebar from './Sidebar'

const pageTitles = {
  [ROUTES.dashboard]: 'Overview',
  [ROUTES.menus]: 'Menus',
}

function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const { user } = useAuth()
  const pageTitle =
    pageTitles[location.pathname] ??
    (location.pathname.startsWith(`${ROUTES.menus}/`) ? 'Menus' : 'Dashboard')

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

          <p className="text-lg font-bold text-[#124b61]">{pageTitle}</p>

          <div className="ml-auto flex items-center gap-1">
            <button
              type="button"
              className="grid h-10 w-10 place-items-center rounded-lg text-[#526b75] hover:bg-[#f1f5f6]"
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
              className="ml-1 grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#1b6079] text-sm font-bold text-white"
              aria-label="Manager profile"
            >
              {user?.name
                ?.split(' ')
                .map((part) => part[0])
                .join('')
                .slice(0, 2)
                .toUpperCase() ?? 'M'}
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-[1320px] px-5 py-7 sm:px-8 sm:py-9">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
