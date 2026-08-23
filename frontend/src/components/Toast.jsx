import { CheckCircle2, XCircle } from 'lucide-react'

export default function Toast({ toast, onClose }) {
  if (!toast) return null
  return (
    <button className={`toast ${toast.type || 'success'}`} onClick={onClose}>
      {toast.type === 'error' ? <XCircle size={18} /> : <CheckCircle2 size={18} />}
      <span>{toast.message}</span>
    </button>
  )
}
