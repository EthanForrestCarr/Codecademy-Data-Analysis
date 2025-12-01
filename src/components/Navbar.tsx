import { useEffect, useState } from 'react'

type NavItem =
  | { id: string; label: string; external?: false }
  | { id: string; label: string; external: true; href: string }

const sections: NavItem[] = [
  { id: 'summary', label: 'Summary' },
  { id: 'how-to-read', label: 'How to read' },
  { id: 'problem', label: 'Problem' },
  { id: 'load-check', label: 'Load & check' },
  { id: 'explore-explain', label: 'Explore' },
  { id: 'charts', label: 'Charts' },
  { id: 'interview-questions', label: 'Interview' },
  { id: 'general-interview', label: 'General Qs', external: true, href: '/interview' },
]

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleMenu = () => setIsMenuOpen(prev => !prev)

  const handleNavClick = (id: string) => {
    setIsMenuOpen(false)
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-30 border-b border-slate-800 transition-colors duration-300 ${
          isScrolled || isMenuOpen
            ? 'bg-slate-950/90 backdrop-blur'
            : 'bg-slate-950/80 backdrop-blur-none'
        }`}
      >
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:py-4">
          <div className="flex flex-col">
            <span className="text-xs font-semibold uppercase tracking-wide text-sky-400">
              Housing Affordability Study
            </span>
            <span className="text-sm text-slate-300">Otter Tail vs Minneapolis</span>
          </div>

          {/* Desktop nav */}
          <nav className="hidden gap-4 text-xs font-medium text-slate-300 sm:flex">
            {sections.map(link =>
              link.external ? (
                <a key={link.id} href={link.href} className="hover:text-sky-300">
                  {link.label}
                </a>
              ) : (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => handleNavClick(link.id)}
                  className="hover:text-sky-300"
                >
                  {link.label}
                </button>
              ),
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={toggleMenu}
            aria-label="Toggle menu"
            className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-700 text-slate-200 sm:hidden"
          >
            <span className="sr-only">Toggle navigation</span>
            <div className="space-y-1.5">
              <span
                className={`block h-0.5 w-5 bg-slate-200 transition-transform ${
                  isMenuOpen ? 'translate-y-1.5 rotate-45' : ''
                }`}
              />
              <span
                className={`block h-0.5 w-5 bg-slate-200 transition-opacity ${
                  isMenuOpen ? 'opacity-0' : 'opacity-100'
                }`}
              />
              <span
                className={`block h-0.5 w-5 bg-slate-200 transition-transform ${
                  isMenuOpen ? '-translate-y-1.5 -rotate-45' : ''
                }`}
              />
            </div>
          </button>
        </div>
      </header>

      {/* Sliding mobile menu */}
      <div
        className={`fixed top-14 right-0 bottom-0 z-20 w-56 transform bg-slate-950/95 backdrop-blur-md shadow-lg transition-transform duration-200 ease-out sm:hidden ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <nav className="flex flex-col items-start gap-3 px-4 py-4 text-sm text-slate-100">
          {sections.map(link =>
            link.external ? (
              <a
                key={link.id}
                href={link.href}
                className="w-full text-left hover:text-sky-300"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </a>
            ) : (
              <button
                key={link.id}
                type="button"
                onClick={() => handleNavClick(link.id)}
                className="w-full text-left hover:text-sky-300"
              >
                {link.label}
              </button>
            ),
          )}
        </nav>
      </div>
    </>
  )
}
