const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

function getToken() {
  return localStorage.getItem('vegitale_token')
}

export function setToken(token) {
  localStorage.setItem('vegitale_token', token)
}

export function clearToken() {
  localStorage.removeItem('vegitale_token')
}

async function request(path, options = {}) {
  const token = getToken()
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })
  if (!res.ok) {
    const detail = await res.json().catch(() => ({}))
    throw new Error(detail.detail || `Request failed: ${res.status}`)
  }
  if (res.status === 204) return null
  return res.json()
}

export const api = {
  // auth
  requestOtp: (phone) => request('/auth/otp/request', { method: 'POST', body: JSON.stringify({ phone }) }),
  verifyOtp: (phone, otp, name) => request('/auth/otp/verify', { method: 'POST', body: JSON.stringify({ phone, otp, name }) }),
  me: () => request('/auth/me'),

  // catalogue
  categories: () => request('/categories'),
  products: (category) => request(`/products${category && category !== 'All' ? `?category=${encodeURIComponent(category)}` : ''}`),
  checkPincode: (pincode) => request('/service-area/check', { method: 'POST', body: JSON.stringify({ pincode }) }),

  // cart
  getCart: () => request('/cart'),
  addToCart: (product_id, quantity = 1) => request('/cart', { method: 'POST', body: JSON.stringify({ product_id, quantity }) }),
  removeCartItem: (id) => request(`/cart/${id}`, { method: 'DELETE' }),

  // addresses
  addresses: () => request('/addresses'),
  createAddress: (payload) => request('/addresses', { method: 'POST', body: JSON.stringify(payload) }),

  // subscriptions
  plans: () => request('/subscriptions/plans'),
  mySubscriptions: () => request('/subscriptions'),
  createSubscription: (payload) => request('/subscriptions', { method: 'POST', body: JSON.stringify(payload) }),
  pauseSubscription: (id) => request(`/subscriptions/${id}/pause`, { method: 'POST' }),
  resumeSubscription: (id) => request(`/subscriptions/${id}/resume`, { method: 'POST' }),
  cancelSubscription: (id) => request(`/subscriptions/${id}/cancel`, { method: 'POST' }),
  skipNext: (id) => request(`/subscriptions/${id}/skip-next`, { method: 'POST' }),

  // orders
  myOrders: () => request('/orders'),
  checkout: (address_id) => request(`/orders/checkout?address_id=${encodeURIComponent(address_id)}`, { method: 'POST' }),

  // payments
  createPaymentOrder: (order_id) => request('/payments/create-order', { method: 'POST', body: JSON.stringify({ order_id }) }),
  verifyPayment: (payload) => request('/payments/verify', { method: 'POST', body: JSON.stringify(payload) }),
}
