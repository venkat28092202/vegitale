import { useEffect, useState } from 'react'
import { ShoppingBasket } from 'lucide-react'
import { api } from '../lib/api.js'

const CATEGORIES = ['All', 'Vegetables', 'Fruits', 'Greens', 'Combo boxes']

const MOCK = [
  { id: 1, name: 'Tomato', category: { name: 'Vegetables' }, price: 40, unit: '1 kg' },
  { id: 2, name: 'Carrot', category: { name: 'Vegetables' }, price: 50, unit: '1 kg' },
  { id: 3, name: 'Spinach', category: { name: 'Greens' }, price: 30, unit: '250 g' },
  { id: 4, name: 'Coriander bunch', category: { name: 'Greens' }, price: 15, unit: '1 bunch' },
  { id: 5, name: 'Banana', category: { name: 'Fruits' }, price: 60, unit: '1 dozen' },
  { id: 6, name: 'Papaya', category: { name: 'Fruits' }, price: 45, unit: '1 pc' },
  { id: 7, name: 'Family Combo Box', category: { name: 'Combo boxes' }, price: 449, unit: '8 kg mixed' },
  { id: 8, name: 'Beetroot', category: { name: 'Vegetables' }, price: 35, unit: '500 g' },
]

const SWATCH = { Vegetables: '#E3A72C', Fruits: '#E3A72C', Greens: '#2F5233', 'Combo boxes': '#8B6F47' }

export default function Products() {
  const [active, setActive] = useState('All')
  const [products, setProducts] = useState(MOCK)
  const [usingMock, setUsingMock] = useState(true)
  const [addedId, setAddedId] = useState(null)

  useEffect(() => {
    api.products(active)
      .then((data) => { setProducts(data); setUsingMock(false) })
      .catch(() => { setProducts(active === 'All' ? MOCK : MOCK.filter((p) => p.category.name === active)); setUsingMock(true) })
  }, [active])

  async function handleAdd(product) {
    try {
      await api.addToCart(product.id, 1)
      setAddedId(product.id)
      setTimeout(() => setAddedId(null), 1200)
    } catch {
      // not signed in or backend unavailable — silently ignore for the demo
      setAddedId(product.id)
      setTimeout(() => setAddedId(null), 1200)
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14">
      <span className="font-mono text-xs uppercase tracking-widest text-crate">Catalogue</span>
      <h1 className="font-display text-4xl font-semibold text-ink mt-2 mb-2">Everything we deliver</h1>
      {usingMock && (
        <p className="text-xs text-ink/40 mb-6">Showing sample data — connect the backend to see your live catalogue.</p>
      )}

      <div className="flex flex-wrap gap-2 mb-10 mt-6">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setActive(c)}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${active === c ? 'bg-forest text-paper border-forest' : 'bg-transparent text-ink/70 border-crate/40 hover:border-forest'}`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((p) => {
          const color = SWATCH[p.category?.name] || '#8B6F47'
          return (
            <div key={p.id} className="bg-paper border border-crate/30 rounded-lg p-5 flex flex-col">
              <div className="w-full aspect-square rounded-md mb-4 flex items-center justify-center" style={{ backgroundColor: `${color}1A` }}>
                <div className="w-16 h-16 rounded-full" style={{ backgroundColor: color }} />
              </div>
              <h3 className="font-display font-semibold text-ink">{p.name}</h3>
              <p className="text-xs text-ink/50 font-mono mb-3">{p.unit}</p>
              <div className="mt-auto flex items-center justify-between">
                <span className="font-mono text-lg text-ink">₹{p.price}</span>
                <button
                  onClick={() => handleAdd(p)}
                  className={`p-2 rounded-full transition-colors ${addedId === p.id ? 'bg-turmeric text-ink' : 'bg-forest text-paper hover:bg-forestDark'}`}
                  aria-label={`Add ${p.name} to cart`}
                >
                  <ShoppingBasket size={16} />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
