import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Check, Eye, EyeOff, LockKeyhole, Mail, UserRound } from 'lucide-react'
import Brand from '../components/Brand'
import { api } from '../lib/api'

export default function Register() {
  const [form, setForm] = useState({ fullName:'', email:'', password:'' })
  const [show, setShow] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const update = (k,v) => setForm(f=>({...f,[k]:v}))

  async function submit(e) {
    e.preventDefault(); setError(''); setLoading(true)
    try {
      await api.register(form)
      api.setCredentials(form.email.trim(), form.password)
      navigate('/app')
    } catch(err) { setError(err.message) } finally { setLoading(false) }
  }

  return (
    <main className="auth-page register-page">
      <section className="auth-visual register-visual">
        <Link to="/" className="back-link"><ArrowLeft size={17}/> Back to FinCore</Link>
        <div className="auth-visual-content">
          <div className="eyebrow">OPEN YOUR FINCORE PROFILE</div>
          <h2>One identity. Multiple accounts. Complete control.</h2>
          <div className="benefit-list">
            <span><Check/> Open Savings and Current accounts</span>
            <span><Check/> Deposit, withdraw and transfer instantly</span>
            <span><Check/> Review a detailed transaction ledger</span>
          </div>
        </div>
      </section>
      <section className="auth-form-side">
        <div className="auth-form-wrap">
          <Brand/>
          <div className="auth-heading"><h1>Create your account</h1><p>Set up your secure FinCore customer profile.</p></div>
          <form onSubmit={submit} className="form-stack">
            <label>Full name<div className="input-shell"><UserRound size={18}/><input required value={form.fullName} onChange={e=>update('fullName',e.target.value)} placeholder="Your full name"/></div></label>
            <label>Email address<div className="input-shell"><Mail size={18}/><input type="email" required value={form.email} onChange={e=>update('email',e.target.value)} placeholder="name@example.com"/></div></label>
            <label>Password<div className="input-shell"><LockKeyhole size={18}/><input minLength="8" type={show?'text':'password'} required value={form.password} onChange={e=>update('password',e.target.value)} placeholder="Minimum 8 characters"/><button type="button" className="icon-btn" onClick={()=>setShow(!show)}>{show?<EyeOff size={17}/>:<Eye size={17}/>}</button></div></label>
            {error && <div className="form-error">{error}</div>}
            <button className="btn btn-primary btn-full btn-lg" disabled={loading}>{loading?'Creating account…':<>Create FinCore profile <ArrowRight size={18}/></>}</button>
          </form>
          <p className="auth-switch">Already registered? <Link to="/login">Sign in</Link></p>
        </div>
      </section>
    </main>
  )
}
