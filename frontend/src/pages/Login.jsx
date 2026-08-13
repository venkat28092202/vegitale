import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../lib/api.js'
import { useAuth } from '../context/AuthContext.jsx'

export default function Login() {
  const [step, setStep] = useState('phone')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { loginWithOtp } = useAuth()
  const navigate = useNavigate()

  async function sendOtp(e) {
    e.preventDefault()
    setError('')
    if (phone.trim().length < 10) return setError('Enter a valid 10-digit mobile number.')
    setLoading(true)
    try {
      await api.requestOtp(phone.trim())
      setStep('otp')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function verify(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await loginWithOtp(phone.trim(), otp.trim(), name.trim() || undefined)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto px-5 sm:px-8 py-20">
      <h1 className="font-display text-3xl font-semibold text-ink mb-2">Sign in to Vegitale</h1>
      <p className="text-ink/60 mb-8 text-sm">We'll text you a one-time code — no password to remember.</p>

      <div className="bg-paper border border-crate/30 rounded-xl p-6">
        {step === 'phone' ? (
          <form onSubmit={sendOtp} className="space-y-4">
            <label className="block text-sm font-medium text-ink/70">Mobile number</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              inputMode="numeric"
              placeholder="98765 43210"
              className="w-full px-4 py-3 rounded-lg border border-crate/40 bg-white/70 font-mono text-sm outline-none focus:border-forest"
            />
            {error && <p className="text-sm text-beet">{error}</p>}
            <button disabled={loading} className="w-full bg-forest text-paper rounded-full py-3 font-medium hover:bg-forestDark transition-colors disabled:opacity-60">
              {loading ? 'Sending…' : 'Send code'}
            </button>
          </form>
        ) : (
          <form onSubmit={verify} className="space-y-4">
            <label className="block text-sm font-medium text-ink/70">Your name (first time only)</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Priya Ramesh"
              className="w-full px-4 py-3 rounded-lg border border-crate/40 bg-white/70 text-sm outline-none focus:border-forest"
            />
            <label className="block text-sm font-medium text-ink/70">Enter the 6-digit code sent to {phone}</label>
            <input
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              inputMode="numeric"
              placeholder="••••••"
              className="w-full px-4 py-3 rounded-lg border border-crate/40 bg-white/70 font-mono text-lg tracking-[0.5em] text-center outline-none focus:border-forest"
            />
            {error && <p className="text-sm text-beet">{error}</p>}
            <button disabled={loading} className="w-full bg-forest text-paper rounded-full py-3 font-medium hover:bg-forestDark transition-colors disabled:opacity-60">
              {loading ? 'Verifying…' : 'Verify & continue'}
            </button>
            <button type="button" onClick={() => setStep('phone')} className="w-full text-sm text-ink/50 hover:text-ink">
              Use a different number
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
