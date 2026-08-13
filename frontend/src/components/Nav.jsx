import { Link, NavLink } from 'react-router-dom'
import { ShoppingBasket, User, Menu, X } from 'lucide-react'
import { useState } from 'react'

const links = [
  { to: '/products', label: 'Boxes' },
  { to: '/subscription', label: 'Subscription' },
  { to: '/#how-it-works', label: 'How it works' },
]

export default function Nav() {
  const [open, setOpen] = useState(false)
  return (
    <header className="sticky top-0 z-50 bg-paper/95 backdrop-blur border-b border-crate/30">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
            <path d="M13 24c-6-2-9-7-9-13 3 0 5 1 6 3 0-5 2-9 6-11 1 5 1 9-1 12 2-1 4-1 6 0-2 5-5 8-8 9Z" fill="#2F5233" />
          </svg>
          <span className="font-display font-semibold text-xl tracking-tight text-ink">Vegitale</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-ink/80">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className={({ isActive }) => `hover:text-forest transition-colors ${isActive ? 'text-forest' : ''}`}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link to="/cart" aria-label="Cart" className="p-2 rounded-full hover:bg-paperDark transition-colors">
            <ShoppingBasket size={20} className="text-ink" />
          </Link>
          <Link to="/login" className="flex items-center gap-2 bg-forest text-paper text-sm font-medium px-4 py-2 rounded-full hover:bg-forestDark transition-colors">
            <User size={16} /> Account
          </Link>
        </div>

        <button className="md:hidden p-2" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-crate/30 bg-paper px-5 py-4 flex flex-col gap-4 text-sm font-medium">
          {links.map((l) => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)}>{l.label}</Link>
          ))}
          <div className="flex gap-3 pt-2">
            <Link to="/cart" onClick={() => setOpen(false)} className="flex items-center gap-1"><ShoppingBasket size={16} /> Cart</Link>
            <Link to="/login" onClick={() => setOpen(false)} className="flex items-center gap-1"><User size={16} /> Account</Link>
          </div>
        </div>
      )}
    </header>
  )
}
