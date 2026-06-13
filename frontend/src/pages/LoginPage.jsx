import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from '../shared/components/Icon'
import { ROUTES } from '../shared/constants/routes'

function LoginPage() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)

  function handleSubmit(event) {
    event.preventDefault()
    navigate(ROUTES.dashboard)
  }

  return (
    <main className="min-h-screen bg-[#f5f7f9] px-4 py-5 text-[#17242b] sm:px-7 sm:py-8 lg:grid lg:place-items-center">
      <section className="mx-auto grid w-full max-w-[1304px] overflow-hidden rounded-2xl border border-[#d8e1e5] bg-white shadow-[0_18px_50px_rgba(18,52,65,0.08)] lg:min-h-[780px] lg:grid-cols-2">
        <div className="relative hidden overflow-hidden bg-[#124b61] text-white lg:flex lg:flex-col">
          <img
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1400&q=85"
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-[#08445a]/80" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0d5770]/20 via-transparent to-[#062f3d]/90" />

          <div className="relative z-10 flex items-center gap-3 px-11 pt-12">
            <Icon name="utensils" size={39} className="text-[#8fd8f5]" />
            <span className="text-[32px] font-extrabold tracking-tight">
              DigiMenu
            </span>
          </div>

          <div className="relative z-10 mt-auto max-w-[590px] px-11 pb-20">
            <h1 className="text-[43px] font-extrabold leading-[1.18] tracking-tight">
              Streamline your dining experience.
            </h1>
            <p className="mt-6 text-[21px] font-medium leading-8 text-white/95">
              Manage menus, track orders, and delight customers with the
              world&apos;s most intuitive restaurant portal.
            </p>
          </div>
        </div>

        <div className="flex items-center px-6 py-10 sm:px-12 lg:px-10 xl:px-14">
          <div className="mx-auto w-full max-w-[568px]">
            <div className="mb-9 flex items-center gap-2.5 text-[#124b61] lg:hidden">
              <Icon name="utensils" size={30} />
              <span className="text-2xl font-extrabold">DigiMenu</span>
            </div>

            <h2 className="text-[32px] font-extrabold tracking-tight text-[#171b1d]">
              Welcome back
            </h2>
            <p className="mt-2 text-[17px] leading-7 text-[#37434a]">
              Enter your credentials to access the management portal.
            </p>

            <form className="mt-10" onSubmit={handleSubmit}>
              <label className="block">
                <span className="mb-2.5 block text-base font-bold text-[#202628]">
                  Email Address
                </span>
                <span className="relative block">
                  <Icon
                    name="mail"
                    size={26}
                    className="absolute left-5 top-1/2 -translate-y-1/2 text-[#bdc7cc]"
                  />
                  <input
                    type="email"
                    name="email"
                    autoComplete="email"
                    required
                    placeholder="name@restaurant.com"
                    className="h-[76px] w-full rounded-lg border border-[#bcc8ce] bg-[#f8fafc] pl-14 pr-5 text-lg outline-none transition placeholder:font-semibold placeholder:text-[#c1c9ce] focus:border-[#17647e] focus:ring-2 focus:ring-[#17647e]/10"
                  />
                </span>
              </label>

              <label className="mt-8 block">
                <span className="mb-2.5 flex items-center justify-between gap-4">
                  <span className="text-base font-bold text-[#202628]">
                    Password
                  </span>
                  <a
                    href="mailto:sales@digimenu.com?subject=Password%20help"
                    className="text-sm font-bold tracking-wide text-[#0e607c] hover:underline"
                  >
                    Forgot password?
                  </a>
                </span>
                <span className="relative block">
                  <Icon
                    name="lock"
                    size={26}
                    className="absolute left-5 top-1/2 -translate-y-1/2 text-[#bdc7cc]"
                  />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    autoComplete="current-password"
                    required
                    minLength={6}
                    placeholder="••••••••"
                    className="h-[76px] w-full rounded-lg border border-[#bcc8ce] bg-[#f8fafc] px-14 text-lg outline-none transition placeholder:font-bold placeholder:tracking-[0.2em] placeholder:text-[#b9c4c9] focus:border-[#17647e] focus:ring-2 focus:ring-[#17647e]/10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    className="absolute right-4 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-lg text-[#b7c2c7] hover:bg-[#edf2f4] hover:text-[#17647e]"
                    aria-label={
                      showPassword ? 'Hide password' : 'Show password'
                    }
                  >
                    <Icon name={showPassword ? 'eyeOff' : 'eye'} size={27} />
                  </button>
                </span>
              </label>

              <label className="mt-7 flex w-fit items-center gap-3 text-base text-[#354148]">
                <input
                  type="checkbox"
                  name="remember"
                  className="h-6 w-6 rounded border-[#bbc8cd] accent-[#17647e]"
                />
                Remember this device for 30 days
              </label>

              <button
                type="submit"
                className="mt-7 flex h-[68px] w-full items-center justify-center gap-3 rounded-lg bg-[#17647e] text-base font-bold text-white shadow-sm transition hover:bg-[#104f66] focus:outline-none focus:ring-4 focus:ring-[#17647e]/20"
              >
                Sign In
                <Icon name="login" size={23} />
              </button>
            </form>

            <div className="mt-10 border-t border-[#bcc8ce] pt-10 text-center text-base text-[#354148]">
              Don&apos;t have an account?{' '}
              <a
                href="mailto:sales@digimenu.com"
                className="font-medium text-[#006481] hover:underline"
              >
                Contact sales
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default LoginPage
