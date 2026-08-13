import { PauseCircle, SkipForward, XCircle, MapPin } from 'lucide-react'

const history = [
  { id: 'ORD-0231', date: '07 Aug 2026', status: 'Delivered' },
  { id: 'ORD-0198', date: '31 Jul 2026', status: 'Delivered' },
  { id: 'ORD-0165', date: '24 Jul 2026', status: 'Delivered' },
]

export default function Dashboard() {
  return (
    <div className="max-w-5xl mx-auto px-5 sm:px-8 py-14">
      <h1 className="font-display text-4xl font-semibold text-ink mb-10">Your subscription</h1>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="md:col-span-2 bg-paper border border-crate/30 rounded-xl p-6">
          <span className="font-mono text-xs uppercase tracking-widest text-crate">Active plan</span>
          <h2 className="font-display text-2xl font-semibold text-ink mt-1 mb-1">Family box · Weekly</h2>
          <p className="text-sm text-ink/60 mb-6">Next delivery: <span className="font-mono text-ink">Thu, 20 Aug 2026</span></p>
          <div className="flex flex-wrap gap-3">
            <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-crate/40 text-sm font-medium text-ink/80 hover:border-forest">
              <PauseCircle size={16} /> Pause subscription
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-crate/40 text-sm font-medium text-ink/80 hover:border-forest">
              <SkipForward size={16} /> Skip next delivery
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-beet/40 text-sm font-medium text-beet hover:bg-beet/5">
              <XCircle size={16} /> Cancel subscription
            </button>
          </div>
        </div>

        <div className="bg-paper border border-crate/30 rounded-xl p-6">
          <span className="font-mono text-xs uppercase tracking-widest text-crate">Delivery address</span>
          <div className="flex items-start gap-2 mt-3">
            <MapPin size={18} className="text-forest shrink-0 mt-0.5" />
            <p className="text-sm text-ink/70 leading-relaxed">12, Gandhi Street,<br />Kanchipuram, Tamil Nadu 631502</p>
          </div>
          <button className="mt-4 text-sm text-forest font-medium hover:underline">Change address</button>
        </div>
      </div>

      <h2 className="font-display text-xl font-semibold text-ink mb-4">Delivery history</h2>
      <div className="bg-paper border border-crate/30 rounded-xl divide-y divide-crate/20">
        {history.map((h) => (
          <div key={h.id} className="flex items-center justify-between px-6 py-4 text-sm">
            <span className="font-mono text-ink/70">{h.id}</span>
            <span className="text-ink/60">{h.date}</span>
            <span className="text-forest font-medium">{h.status}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
