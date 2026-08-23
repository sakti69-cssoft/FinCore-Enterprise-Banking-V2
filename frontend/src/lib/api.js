const API_BASE = import.meta.env.VITE_API_BASE || ''

const getAuth = () => {
  const credentials = localStorage.getItem('fincore.credentials')
  return credentials ? `Basic ${btoa(credentials)}` : null
}

async function request(path, options = {}) {
  const auth = getAuth()
  const headers = {
    Accept: 'application/json',
    ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    ...(auth ? { Authorization: auth } : {}),
    ...options.headers,
  }

  const response = await fetch(`${API_BASE}${path}`, { ...options, headers })
  const text = await response.text()
  const data = text ? JSON.parse(text) : null

  if (!response.ok) {
    const message = data?.message || data?.error || `Request failed (${response.status})`
    throw new Error(message)
  }
  return data
}

export const api = {
  setCredentials(email, password) {
    localStorage.setItem('fincore.credentials', `${email}:${password}`)
  },
  clearCredentials() {
    localStorage.removeItem('fincore.credentials')
  },
  hasCredentials() {
    return Boolean(localStorage.getItem('fincore.credentials'))
  },
  health: () => request('/actuator/health'),
  register: (body) => request('/api/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  me: () => request('/api/auth/me'),
  accounts: () => request('/api/accounts'),
  dashboard: () => request('/api/accounts/dashboard'),
  updateProfile: (body) => request('/api/auth/profile', { method: 'PUT', body: JSON.stringify(body) }),
  beneficiaries: () => request('/api/beneficiaries'),
  addBeneficiary: (body) => request('/api/beneficiaries', { method: 'POST', body: JSON.stringify(body) }),
  serviceRequests: () => request('/api/service-requests'),
  createServiceRequest: (body) => request('/api/service-requests', { method: 'POST', body: JSON.stringify(body) }),
  createAccount: (accountType) => request('/api/accounts', { method: 'POST', body: JSON.stringify({ accountType }) }),
  deposit: (accountNumber, body) => request(`/api/accounts/${accountNumber}/deposit`, { method: 'POST', body: JSON.stringify(body) }),
  withdraw: (accountNumber, body) => request(`/api/accounts/${accountNumber}/withdraw`, { method: 'POST', body: JSON.stringify(body) }),
  transfer: (body) => request('/api/accounts/transfer', { method: 'POST', body: JSON.stringify(body) }),
  transactions: (accountNumber) => request(`/api/accounts/${accountNumber}/transactions`),
}
