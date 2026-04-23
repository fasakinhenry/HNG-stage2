import { Link, NavLink, Outlet } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'
import { Icon } from '../components/ui/Icon'

export function AppLayout() {
  const { theme, toggleTheme } = useTheme()
  const { user, logout } = useAuth()
  const [showProfile, setShowProfile] = useState(false)
  const profileMenuRef = useRef<HTMLDivElement | null>(null)

  const avatarPreview = user?.avatarUrl
    ? user.avatarUrl.startsWith('http')
      ? user.avatarUrl
      : `${import.meta.env.VITE_API_URL?.replace('/api', '') ?? 'http://localhost:5000'}${user.avatarUrl}`
    : 'https://i.pravatar.cc/120?img=32'

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        showProfile &&
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setShowProfile(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showProfile])

  return (
    <div className="min-h-screen bg-(--color-page) text-(--color-text-heading)">
      <div className="mx-auto flex min-h-screen max-w-360 flex-col lg:flex-row">
        <aside className="z-30 flex sm:h-20 h-18 w-full items-center justify-between rounded-none bg-(--color-nav) lg:h-auto lg:w-25.75 lg:flex-col lg:rounded-r-3xl overflow-visible">
          <Link to="/" aria-label="Go to invoices">
            <img
              src="/logo.svg"
              alt="Invoice app Logo"
              className="md:h-25.75 md:w-25.75 w-18 h-18 sm:w-20 sm:h-20 md:-mt-1.5"
            />
          </Link>

          <div className="flex h-full items-center lg:h-auto lg:w-full lg:flex-col">
            <button
              className="mx-4 rounded-full p-6 text-(--color-text-subtle) cursor-pointer transition hover:text-white focus-visible:outline-2 focus-visible:outline-(--color-primary)"
              type="button"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              <Icon name={theme === 'light' ? 'moon' : 'sun'} className="h-5 w-5" />
            </button>

            <div
              ref={profileMenuRef}
              className="relative border-l border-(--color-border-strong) px-5 lg:w-full lg:border-l-0 lg:border-t lg:py-6"
            >
              <button
                type="button"
                onClick={() => setShowProfile((prev) => !prev)}
                className="h-10 w-10 overflow-hidden rounded-full border-2 border-transparent cursor-pointer transition hover:border-(--color-primary)"
                aria-label="Open profile menu"
              >
                <img
                  src={avatarPreview}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              </button>

              {showProfile ? (
                <div className="absolute right-0 top-14 w-52 rounded-lg bg-(--color-panel) p-4 shadow-[0_15px_30px_rgba(0,0,0,0.2)] lg:left-full lg:top-1/2 lg:ml-3 lg:-translate-y-1/2 z-20">
                  {user ? (
                    <>
                      <p className="text-[13px] text-(--color-text-muted)">Signed in as</p>
                      <p className="mt-1 text-[15px] font-bold">{user.name}</p>
                      <p className="mt-1 text-[13px] text-(--color-text-muted)">{user.email}</p>
                      <NavLink
                        to="/settings"
                        className="mt-3 inline-block text-[13px] font-bold text-(--color-primary)"
                        onClick={() => setShowProfile(false)}
                      >
                        Open Settings
                      </NavLink>
                      <button
                        type="button"
                        className="mt-2 block text-[13px] font-bold text-(--color-danger)"
                        onClick={() => {
                          logout()
                          setShowProfile(false)
                        }}
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <p className="text-[13px] text-(--color-text-muted)">Welcome</p>
                      <p className="mt-1 text-[15px] font-bold">Guest User</p>
                      <NavLink
                        to="/login"
                        className="mt-3 inline-block text-[13px] font-bold text-(--color-primary)"
                        onClick={() => setShowProfile(false)}
                      >
                        Login
                      </NavLink>
                      <NavLink
                        to="/signup"
                        className="mt-2 block text-[13px] font-bold text-(--color-primary)"
                        onClick={() => setShowProfile(false)}
                      >
                        Sign Up
                      </NavLink>
                    </>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        </aside>

        <main className="w-full px-6 py-8 sm:px-10 lg:px-14 lg:py-16">
          <div className="mx-auto max-w-190">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
