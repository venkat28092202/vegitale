import { useState } from 'react'
import { CheckCircle2 } from 'lucide-react'

const plans = [
  { id: 'basic', name: 'Basic', price: 499, desc: '6 everyday vegetables for a small household.', features: ['4–5 kg per delivery', 'Swap up to 2 items'] },
  { id: 'family', name: 'Family', price: 899, desc: 'Our most popular box — built for 3–4 people.', features: ['8–9 kg per delivery', 'Swap up to 4 items', 'Free seasonal fruit add-on'], featured: true },
  { id: 'premium', name: 'Premium', price: 1399, desc: 'Organic-first selection with rare & exotic picks.', features: ['10–12 kg per delivery', 'Full customisation', 'Priority delivery window'] },
]

const frequencies = [
  { id: 'weekly', label: 'Weekly', note: 'Delivered every Thursday' },
  { id: 'biweekly', label: 'Bi-weekly', note: 'Delivered every other Thursday' },
  { id: 'monthly', label: 'Monthly', note: 'Delivered once a month' },
]

export default function Subscription() {
  const [planId, setPlanId] = useState('family')
  const [freq, setFreq] = useState('weekly')
  const plan = plans.find((p) => p.id === planId)

  return (
    <div className="max-w-5xl mx-auto px-5 sm:px-8 py-14">
      <span className="font-mono text-xs uppercase tracking-widest text-crate">Build your subscription</span>
      <h1 className="font-display text-4xl font-semibold text-ink mt-2 mb-10">Set it once, eat fresh every cycle.</h1>

      <h2 className="font-display text-lg font-semibold text-ink mb-4">1. Choose a box</h2>
      <div className="grid md:grid-cols-3 gap-5 mb-12">
        {plans.map((p) => (
          <button
            key={p.id}
            onClick={() => setPlanId(p.id)}
            className={`text-left rounded-xl p-6 border transition-colors ${planId === p.id ? 'border-forest bg-forest/5 ring-2 ring-forest' : 'border-crate/30 bg-paper hover:border-forest/60'}`}
          >
            <h3 className="font-display text-xl font-semibold text-ink mb-1">{p.name}</h3>
            <p className="text-sm text-ink/60 mb-3">{p.desc}</p>
            <div className="font-mono text-2xl text-ink mb-3">₹{p.price}<span className="text-sm opacity-60">/cycle</span></div>
            <ul className="space-y-1 text-sm">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-ink/70">
                  <CheckCircle2 size={14} className="mt-1 text-forest shrink-0" /> {f}
                </li>
              ))}
            </ul>
          </button>
        ))}
      </div>

      <h2 className="font-display text-lg font-semibold text-ink mb-4">2. Delivery frequency</h2>
      <div className="grid sm:grid-cols-3 gap-4 mb-12">
        {frequencies.map((f) => (
          <button
            key={f.id}
            onClick={() => setFreq(f.id)}
            className={`rounded-lg p-4 border text-left transition-colors ${freq === f.id ? 'border-forest bg-forest/5 ring-2 ring-forest' : 'border-crate/30 bg-paper hover:border-forest/60'}`}
          >
            <div className="font-medium text-ink">{f.label}</div>
            <div className="text-xs text-ink/50 font-mono mt-1">{f.note}</div>
          </button>
        ))}
      </div>

      <div className="bg-paperDark/60 border border-crate/30 rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="text-sm text-ink/60">You're subscribing to</p>
          <p className="font-display text-xl font-semibold text-ink">{plan.name} box, {freq}</p>
          <p className="font-mono text-lg text-ink mt-1">₹{plan.price} <span className="text-xs opacity-60">per cycle</span></p>
        </div>
        <button className="bg-forest text-paper rounded-full px-8 py-3 font-medium hover:bg-forestDark transition-colors">
          Continue to checkout
        </button>
      </div>
      <p className="text-xs text-ink/40 mt-4">You can pause, skip, or cancel anytime from your dashboard — no calls needed.</p>
    </div>
  )
}
