import { Landmark } from 'lucide-react'

export default function Brand({ compact = false }) {
  return (
    <div className="brand">
      <div className="brand-mark"><Landmark size={compact ? 18 : 22} /></div>
      <div>
        <div className="brand-name">FinCore</div>
        {!compact && <div className="brand-sub">Enterprise Digital Banking</div>}
      </div>
    </div>
  )
}
