import { Link } from 'react-router-dom'
import Icon from '../shared/components/Icon'
import { ROUTES } from '../shared/constants/routes'

function DashboardPage() {
  return (
    <section>
      <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-[#24718a]">
        Restaurant workspace
      </p>
      <h1 className="text-2xl font-bold tracking-tight sm:text-[30px]">
        Dashboard
      </h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-[#62757d]">
        Manage your digital menus and keep restaurant offerings organized.
      </p>

      <Link
        to={ROUTES.menus}
        className="mt-7 flex max-w-md items-center gap-4 rounded-xl border border-[#dbe3e6] bg-white p-5 shadow-[0_1px_3px_rgba(22,55,65,0.04)] transition hover:border-[#aebfc5]"
      >
        <span className="grid h-11 w-11 place-items-center rounded-lg bg-[#edf5f7] text-[#1b6079]">
          <Icon name="menus" size={20} />
        </span>
        <span>
          <strong className="block text-sm">Manage menus</strong>
          <span className="mt-1 block text-xs text-[#6a7b82]">
            Create menus and maintain their items
          </span>
        </span>
        <Icon name="chevron" size={17} className="ml-auto text-[#809096]" />
      </Link>
    </section>
  )
}

export default DashboardPage
