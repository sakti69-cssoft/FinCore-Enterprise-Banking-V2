import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Eye, EyeOff, LockKeyhole, Mail, ShieldCheck } from 'lucide-react'
import Brand from '../components/Brand'
import { api } from '../lib/api'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function submit(e) {
    e.preventDefault(); setError(''); setLoading(true)
    try {
      api.setCredentials(email.trim(), password)
      await api.me()
      navigate('/app')
    } catch (err) {
      api.clearCredentials(); setError('Email or password is incorrect.')
    } finally { setLoading(false) }
  }

  return (
    <main className="auth-page">
      <section className="auth-visual">
        <Link to="/" className="back-link"><ArrowLeft size={17}/> Back to FinCore</Link>
        <div className="auth-visual-content">
          <div className="security-orbit"><ShieldCheck size={50}/></div>
          <h2>Welcome back to your financial command center.</h2>
          <p>Secure access to your accounts, balances, transfers and transaction history.</p>
          <div className="auth-proof"><LockKeyhole size={18}/><span>Your credentials are used only to authenticate securely with FinCore.</span></div>
        </div>
      </section>
      <section className="auth-form-side">
        <div className="auth-form-wrap">
          <Brand/>
          <div className="auth-heading"><h1>Sign in</h1><p>Enter your FinCore credentials to continue.</p></div>
          <form onSubmit={submit} className="form-stack">
            <label>Email address<div className="input-shell"><Mail size={18}/><input type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="name@example.com"/></div></label>
            <label>Password<div className="input-shell"><LockKeyhole size={18}/><input type={show?'text':'password'} required value={password} onChange={e=>setPassword(e.target.value)} placeholder="Your password"/><button type="button" className="icon-btn" onClick={()=>setShow(!show)}>{show?<EyeOff size={17}/>:<Eye size={17}/>}</button></div></label>
            {error && <div className="form-error">{error}</div>}
            <button className="btn btn-primary btn-full btn-lg" disabled={loading}>{loading?'Signing in…':<>Sign in <ArrowRight size={18}/></>}</button>
          </form>
          <p className="auth-switch">New to FinCore? <Link to="/register">Create an account</Link></p>
        </div>
      </section>
    </main>
  )
}
