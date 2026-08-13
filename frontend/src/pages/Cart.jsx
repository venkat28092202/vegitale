import { useState } from 'react'
import { Minus, Plus, Trash2 } from 'lucide-react'

const initial = [
  { id: 1, name: 'Family Combo Box', unit: '8 kg mixed', price: 449, qty: 1 },
  { id: 2, name: 'Coriander bunch', unit: '1 bunch', price: 15, qty: 3 },
]

export default function Cart() {
  const [items, setItems] = useState(initial)

  const updateQty = (id, delta) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, qty: Math.max(1, it.qty + delta) } : it)))
  }
  const remove = (id) => setItems((prev) => prev.filter((it) => it.id !== id))
  const subtotal = items.reduce((sum, it) => sum + it.price * it.qty, 0)
  const delivery = items.length ? 30 : 0
  const total = subtotal + delivery

  return (
    <div className="max-w-4xl mx-auto px-5 sm:px-8 py-14">
      <h1 className="font-display text-4xl font-semibold text-ink mb-10">Your cart</h1>

      {items.length === 0 ? (
        <p className="text-ink/60">Your cart is empty. Head to the catalogue to add something fresh.</p>
      ) : (
        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-4">
            {items.map((it) => (
              <div key={it.id} className="flex items-center gap-4 bg-paper border border-crate/30 rounded-lg p-4">
                <div className="w-14 h-14 rounded-md bg-forest/10 shrink-0" />
                <div className="flex-1">
                  <h3 className="font-display font-semibold text-ink">{it.name}</h3>
                  <p className="text-xs text-ink/50 font-mono">{it.unit}</p>
                </div>
                <div className="flex items-center gap-2 border border-crate/30 rounded-full px-2 py-1">
                  <button onClick={() => updateQty(it.id, -1)} className="p-1" aria-label="Decrease quantity"><Minus size={14} /></button>
                  <span className="w-5 text-center text-sm font-mono">{it.qty}</span>
                  <button onClick={() => updateQty(it.id, 1)} className="p-1" aria-label="Increase quantity"><Plus size={14} /></button>
                </div>
                <span className="font-mono text-ink w-16 text-right">₹{it.price * it.qty}</span>
                <button onClick={() => remove(it.id)} className="p-2 text-beet hover:bg-beet/10 rounded-full" aria-label={`Remove ${it.name}`}>
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          <div className="bg-paperDark/60 border border-crate/30 rounded-xl p-6 h-fit">
            <h2 className="font-display font-semibold text-lg text-ink mb-4">Order summary</h2>
            <div className="space-y-2 text-sm text-ink/70 mb-4">
              <div className="flex justify-between"><span>Subtotal</span><span className="font-mono">₹{subtotal}</span></div>
              <div className="flex justify-between"><span>Delivery</span><span className="font-mono">₹{delivery}</span></div>
            </div>
            <div className="flex justify-between font-display font-semibold text-lg text-ink border-t border-crate/30 pt-4 mb-6">
              <span>Total</span><span className="font-mono">₹{total}</span>
            </div>
            <button className="w-full bg-forest text-paper rounded-full py-3 font-medium hover:bg-forestDark transition-colors">
              Proceed to payment
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
