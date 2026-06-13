import { Link } from 'react-router-dom'
import { ROUTES } from '../shared/constants/routes'

function NotFoundPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#f5f7f8] px-5 text-center text-[#17242b]">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#24718a]">
          404
        </p>
        <h1 className="mt-3 text-3xl font-bold">Page not found</h1>
        <p className="mt-2 text-sm text-[#62757d]">
          The page you requested does not exist.
        </p>
        <Link
          to={ROUTES.dashboard}
          className="mt-6 inline-flex h-10 items-center rounded-lg bg-[#154f65] px-5 text-sm font-bold text-white"
        >
          Return to dashboard
        </Link>
      </div>
    </main>
  )
}

export default NotFoundPage
