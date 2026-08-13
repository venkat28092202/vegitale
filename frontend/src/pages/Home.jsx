import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Leaf, Truck, PauseCircle, PackageX, ArrowRight, CheckCircle2 } from 'lucide-react'
import CrateArt from '../components/CrateArt.jsx'
import { api } from '../lib/api.js'

function PincodeChecker({ variant = 'light' }) {
  const [value, setValue] = useState('')
  const [status, setStatus] = useState(null) // null | 'yes' | 'no' | 'error'

  async function check(e) {
    e.preventDefault()
    if (value.trim().length !== 6) return
    try {
      const res = await api.checkPincode(value.trim())
      setStatus(res.serviceable ? 'yes' : 'no')
    } catch {
      setStatus('error')
    }
  }

  const dark = variant === 'dark'
  return (
    <div>
      <form onSubmit={check} className="flex items-stretch gap-0 max-w-sm">
        <input
          value={value}
          onChange={(e) => { setValue(e.target.value); setStatus(null) }}
          inputMode="numeric"
          maxLength={6}
          placeholder="Enter your pincode"
          className={`flex-1 px-4 py-3 rounded-l-full border font-mono text-sm outline-none ${dark ? 'bg-forestDark/40 border-paper/30 text-paper placeholder:text-paper/50 focus:border-turmeric' : 'bg-white/70 border-crate/40 text-ink placeholder:text-ink/40 focus:border-forest'}`}
        />
        <button className={`px-5 rounded-r-full font-medium text-sm ${dark ? 'bg-turmeric text-ink' : 'bg-forest text-paper'} hover:opacity-90 transition-opacity`}>
          Check
        </button>
      </form>
      {status === 'yes' && (
        <p className={`mt-2 text-sm flex items-center gap-1 ${dark ? 'text-turmeric' : 'text-forest'}`}>
          <CheckCircle2 size={16} /> We deliver to you — build your first box.
        </p>
      )}
      {status === 'no' && (
        <p className="mt-2 text-sm text-beet">Not yet in this pincode — we're expanding routes monthly.</p>
      )}
      {status === 'error' && (
        <p className="mt-2 text-sm text-beet">Couldn't reach the server — make sure the backend is running.</p>
      )}
    </div>
  )
}

const tickets = [
  { day: 'MON', time: 'anytime', title: 'Choose your box', copy: 'Pick Basic, Family or Premium — or customise what goes in it.' },
  { day: 'TUE', time: '11:59 PM', title: 'Orders lock', copy: 'Your cycle closes so we know exactly what to harvest.' },
  { day: 'WED', time: 'dawn', title: 'Harvested & packed', copy: 'Produce is pulled from partner farms and boxed same-day.' },
  { day: 'THU', time: 'by noon', title: 'Delivered to your door', copy: 'Fresh, no middle warehouse, no cold storage delay.' },
]

const plans = [
  { name: 'Basic', price: '₹499', per: '/month', desc: '6 everyday vegetables for a small household.', features: ['4–5 kg per delivery', 'Weekly delivery', 'Swap up to 2 items'] },
  { name: 'Family', price: '₹899', per: '/month', desc: 'Our most popular box — built for 3–4 people.', features: ['8–9 kg per delivery', 'Weekly delivery', 'Swap up to 4 items', 'Free seasonal fruit add-on'], featured: true },
  { name: 'Premium', price: '₹1,399', per: '/month', desc: 'Organic-first selection with rare & exotic picks.', features: ['10–12 kg per delivery', 'Weekly delivery', 'Full customisation', 'Priority delivery window'] },
]

const badges = [
  { icon: Leaf, title: 'Local farms only', copy: 'Sourced within 120km, no long-haul cold chain.' },
  { icon: Truck, title: '12-hour promise', copy: 'Delivered within 12 hours of harvest, every cycle.' },
  { icon: PauseCircle, title: 'Pause anytime', copy: 'Skip a week or cancel from your dashboard, no calls.' },
  { icon: PackageX, title: 'Zero plastic', copy: 'Packed in reusable crates and compostable liners.' },
]

const quotes = [
  { text: 'The Tuesday cutoff actually made me plan meals better. Everything shows up crisp, never limp.', name: 'Priya R.', place: 'Kanchipuram' },
  { text: 'Switched from the local market run — Vegitale is cheaper once you count the petrol and time.', name: 'Arun K.', place: 'Chennai' },
  { text: 'Paused it for two weeks while travelling in one tap. That alone earned my subscription.', name: 'Meera S.', place: 'Vellore' },
]

export default function Home() {
  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-14 pb-20 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-block font-mono text-xs tracking-widest uppercase text-crate border border-crate/40 rounded-full px-3 py-1 mb-6">
              Harvested this week · Vol. 34
            </div>
            <h1 className="font-display text-5xl sm:text-6xl leading-[1.05] font-semibold text-ink">
              Fresh off the field,
              <br />not off a shelf.
            </h1>
            <p className="mt-6 text-ink/70 text-lg max-w-md leading-relaxed">
              Choose a box, set your delivery day, and we handle the rest — sourced from local farms and on your doorstep on a schedule that runs itself.
            </p>
            <div className="mt-8">
              <PincodeChecker />
            </div>
            <div className="mt-8 flex items-center gap-6 text-sm text-ink/60 font-mono">
              <span>500+ families</span>
              <span className="w-1 h-1 rounded-full bg-ink/30" />
              <span>40 partner farms</span>
              <span className="w-1 h-1 rounded-full bg-ink/30" />
              <span>12h harvest-to-door</span>
            </div>
          </div>
          <CrateArt />
        </div>
      </section>

      {/* HOW IT WORKS — harvest ticket sequence */}
      <section id="how-it-works" className="bg-paperDark/50 py-20">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="mb-12 max-w-xl">
            <span className="font-mono text-xs uppercase tracking-widest text-crate">The cycle</span>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-ink mt-2">One week, one ticket, one delivery.</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {tickets.map((t, i) => (
              <div key={t.title} className="relative">
                <div className="bg-paper border border-crate/30 rounded-lg p-5 pb-7 ticket-edge relative">
                  <div className="flex items-baseline justify-between font-mono text-xs text-crate mb-4">
                    <span>{String(i + 1).padStart(2, '0')}</span>
                    <span>{t.day} · {t.time}</span>
                  </div>
                  <h3 className="font-display text-lg font-semibold text-ink mb-2">{t.title}</h3>
                  <p className="text-sm text-ink/65 leading-relaxed">{t.copy}</p>
                </div>
                {i < tickets.length - 1 && (
                  <ArrowRight className="hidden lg:block absolute top-1/2 -right-4 -translate-y-1/2 text-crate/50" size={18} />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PLANS */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="mb-12 max-w-xl">
            <span className="font-mono text-xs uppercase tracking-widest text-crate">Subscription boxes</span>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-ink mt-2">Pick a box. Change it whenever.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((p) => (
              <div key={p.name} className={`rounded-xl p-7 flex flex-col border ${p.featured ? 'bg-forest text-paper border-forest' : 'bg-paper border-crate/30 text-ink'}`}>
                {p.featured && <span className="font-mono text-xs uppercase tracking-widest text-turmeric mb-3">Most popular</span>}
                <h3 className="font-display text-2xl font-semibold mb-1">{p.name}</h3>
                <p className={`text-sm mb-5 ${p.featured ? 'text-paper/70' : 'text-ink/60'}`}>{p.desc}</p>
                <div className="font-mono text-3xl mb-6">{p.price}<span className="text-sm opacity-60">{p.per}</span></div>
                <ul className="space-y-2 mb-8 text-sm flex-1">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <CheckCircle2 size={16} className={`mt-0.5 shrink-0 ${p.featured ? 'text-turmeric' : 'text-forest'}`} />
                      <span className={p.featured ? 'text-paper/90' : 'text-ink/75'}>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/subscription" className={`text-center rounded-full py-3 font-medium text-sm transition-opacity hover:opacity-90 ${p.featured ? 'bg-turmeric text-ink' : 'bg-ink text-paper'}`}>
                  Start {p.name.toLowerCase()} box
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST BADGES */}
      <section className="bg-paperDark/50 py-20">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {badges.map(({ icon: Icon, title, copy }) => (
            <div key={title} className="text-center flex flex-col items-center">
              <div className="w-14 h-14 rounded-full border-2 border-forest flex items-center justify-center mb-4">
                <Icon className="text-forest" size={24} />
              </div>
              <h3 className="font-display font-semibold text-ink mb-1">{title}</h3>
              <p className="text-sm text-ink/60 leading-relaxed">{copy}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-ink mb-12">What subscribers say</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {quotes.map((q) => (
              <blockquote key={q.name} className="bg-paper border border-crate/30 rounded-lg p-6">
                <p className="text-ink/80 leading-relaxed mb-4">"{q.text}"</p>
                <footer className="font-mono text-xs text-crate">{q.name} · {q.place}</footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BAND */}
      <section className="bg-forestDark py-20">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-paper max-w-md">
            Your first box can be on the way by next Thursday.
          </h2>
          <PincodeChecker variant="dark" />
        </div>
      </section>
    </div>
  )
}
