import { Link } from 'react-router-dom'
import { ArrowRight, BadgeCheck, BarChart3, LockKeyhole, ShieldCheck, Sparkles, WalletCards, Zap } from 'lucide-react'
import Brand from '../components/Brand'

export default function Landing() {
  return (
    <main className="landing">
      <header className="topbar shell">
        <Brand compact />
        <nav className="landing-nav">
          <a href="#features">Features</a>
          <a href="#security">Security</a>
          <Link className="btn btn-ghost" to="/login">Sign in</Link>
          <Link className="btn btn-primary" to="/register">Open account <ArrowRight size={16}/></Link>
        </nav>
      </header>

      <section className="hero shell">
        <div className="hero-copy">
          <div className="eyebrow"><Sparkles size={15}/> Banking, engineered beautifully</div>
          <h1>Your money deserves a <span>smarter core.</span></h1>
          <p>FinCore brings accounts, transfers and real-time transaction visibility into one secure, refined banking experience.</p>
          <div className="hero-actions">
            <Link className="btn btn-primary btn-lg" to="/register">Start banking <ArrowRight size={18}/></Link>
            <Link className="btn btn-soft btn-lg" to="/login">View dashboard</Link>
          </div>
          <div className="trust-row">
            <span><ShieldCheck size={17}/> Secure by design</span>
            <span><Zap size={17}/> Real-time banking</span>
            <span><BadgeCheck size={17}/> Enterprise architecture</span>
          </div>
        </div>

        <div className="hero-product">
          <div className="glow-orb orb-one"/><div className="glow-orb orb-two"/>
          <div className="mock-window glass">
            <div className="mock-header"><Brand compact/><div className="avatar">SP</div></div>
            <div className="mock-balance">
              <span>Total balance</span>
              <strong>₹—.00</strong>
              <small>Across 2 active accounts</small>
            </div>
            <div className="mini-stats">
              <div><span>Income</span><strong>+₹—</strong></div>
              <div><span>Spent</span><strong>₹—</strong></div>
            </div>
            <div className="mock-card-row">
              <div className="bank-card dark-card"><small>FINCORE • SAVINGS</small><strong>₹50,000</strong><span>•••• 6396</span></div>
              <div className="bank-card light-card"><small>FINCORE • CURRENT</small><strong>₹20,000</strong><span>•••• 4249</span></div>
            </div>
            <div className="mock-transactions">
              <div className="section-label">Recent activity</div>
              <div className="mock-tx"><div className="tx-icon up">↙</div><div><b>Salary credit</b><small>Live balance after sign in</small></div><strong className="positive">+₹—</strong></div>
              <div className="mock-tx"><div className="tx-icon">↗</div><div><b>Transfer</b><small>To Current Account</small></div><strong>-₹20,000</strong></div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="feature-strip shell">
        <article><div className="feature-icon"><WalletCards/></div><h3>Multi-account banking</h3><p>Manage Savings and Current accounts under one identity.</p></article>
        <article><div className="feature-icon"><BarChart3/></div><h3>Instant visibility</h3><p>See balances and transaction history the moment money moves.</p></article>
        <article id="security"><div className="feature-icon"><LockKeyhole/></div><h3>Protected access</h3><p>Authenticated banking APIs, password hashing and role-based controls.</p></article>
      </section>

      <footer className="landing-footer shell">© 2026 FinCore • Enterprise Banking Management System</footer>
    </main>
  )
}
