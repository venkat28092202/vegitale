import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-forestDark text-paper mt-24">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14 grid gap-10 md:grid-cols-4">
        <div>
          <div className="font-display text-xl font-semibold mb-3">Vegitale</div>
          <p className="text-paper/60 text-sm leading-relaxed">Fresh vegetables, sourced from local farms and delivered on the schedule you set.</p>
        </div>
        <div>
          <div className="font-mono text-xs uppercase tracking-wider text-paper/50 mb-4">Shop</div>
          <ul className="space-y-2 text-sm text-paper/80">
            <li><Link to="/products" className="hover:text-turmeric">All boxes</Link></li>
            <li><Link to="/subscription" className="hover:text-turmeric">Subscription plans</Link></li>
            <li><Link to="/cart" className="hover:text-turmeric">Your cart</Link></li>
          </ul>
        </div>
        <div>
          <div className="font-mono text-xs uppercase tracking-wider text-paper/50 mb-4">Account</div>
          <ul className="space-y-2 text-sm text-paper/80">
            <li><Link to="/login" className="hover:text-turmeric">Sign in</Link></li>
            <li><Link to="/dashboard" className="hover:text-turmeric">Manage deliveries</Link></li>
          </ul>
        </div>
        <div>
          <div className="font-mono text-xs uppercase tracking-wider text-paper/50 mb-4">Service area</div>
          <p className="text-sm text-paper/80">Check your pincode on the home page to see if we deliver to you yet — we're adding new routes every month.</p>
        </div>
      </div>
      <div className="border-t border-paper/10">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-5 flex flex-col sm:flex-row justify-between gap-2 text-xs font-mono text-paper/40">
          <span>© {new Date().getFullYear()} Vegitale — Vol. sourced fresh, every cycle.</span>
          <span>Made for people who taste the difference.</span>
        </div>
      </div>
    </footer>
  )
}
