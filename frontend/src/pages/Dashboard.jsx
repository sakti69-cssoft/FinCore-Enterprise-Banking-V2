import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowDownLeft, ArrowRight, ArrowUpRight, Bell, Building2, ChevronDown, CircleDollarSign,
  CreditCard, History, Home, Landmark, LogOut, Menu, Plus, RefreshCw, Search, Send,
  ShieldCheck, Sparkles, UserRound, WalletCards, X
} from 'lucide-react'
import { api } from '../lib/api'
import Brand from '../components/Brand'
import Toast from '../components/Toast'

const inr = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 })
const money = n => inr.format(Number(n || 0))
const last4 = n => String(n || '').slice(-4)
const typeLabel = t => ({DEPOSIT:'Deposit', WITHDRAWAL:'Withdrawal', TRANSFER_OUT:'Transfer sent', TRANSFER_IN:'Transfer received'}[t] || t)

function Modal({ title, subtitle, children, onClose }) {
  return <div className="modal-backdrop" onMouseDown={onClose}><section className="modal" onMouseDown={e=>e.stopPropagation()}><div className="modal-head"><div><h3>{title}</h3><p>{subtitle}</p></div><button className="icon-btn modal-close" onClick={onClose}><X size={19}/></button></div>{children}</section></div>
}

export default function Dashboard() {
  const nav = useNavigate()
  const [user, setUser] = useState(null)
  const [accounts, setAccounts] = useState([])
  const [transactions, setTransactions] = useState([])
  const [selected, setSelected] = useState('')
  const [view, setView] = useState('overview')
  const [modal, setModal] = useState(null)
  const [toast, setToast] = useState(null)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [query, setQuery] = useState('')
  const [mobileNav, setMobileNav] = useState(false)

  async function load() {
    setLoading(true)
    try {
      const [me, accs] = await Promise.all([api.me(), api.accounts()])
      setUser(me); setAccounts(accs)
      const first = selected || accs[0]?.accountNumber || ''
      setSelected(first)
      if (first) setTransactions(await api.transactions(first))
      else setTransactions([])
    } catch (err) {
      if (/401|unauthorized|credentials/i.test(err.message)) logout()
      else setToast({type:'error', message:err.message})
    } finally { setLoading(false) }
  }

  useEffect(()=>{ load() }, [])

  useEffect(()=>{
    if (!selected) return
    api.transactions(selected).then(setTransactions).catch(e=>setToast({type:'error',message:e.message}))
  }, [selected])

  const totalBalance = useMemo(()=>accounts.reduce((s,a)=>s+Number(a.balance),0),[accounts])
  const incoming = useMemo(()=>transactions.filter(t=>['DEPOSIT','TRANSFER_IN'].includes(t.type)).reduce((s,t)=>s+Number(t.amount),0),[transactions])
  const outgoing = useMemo(()=>transactions.filter(t=>['WITHDRAWAL','TRANSFER_OUT'].includes(t.type)).reduce((s,t)=>s+Number(t.amount),0),[transactions])
  const filtered = transactions.filter(t => `${t.type} ${t.description} ${t.reference} ${t.counterpartyAccount}`.toLowerCase().includes(query.toLowerCase()))

  function logout(){ api.clearCredentials(); nav('/login') }
  function notify(message,type='success'){ setToast({message,type}); setTimeout(()=>setToast(null),3500) }

  async function createAccount(type){
    setBusy(true)
    try { const a=await api.createAccount(type); notify(`${type} account •••• ${last4(a.accountNumber)} created`); setModal(null); await load() }
    catch(e){notify(e.message,'error')} finally {setBusy(false)}
  }

  async function moneyAction(kind, data){
    setBusy(true)
    try {
      const account = data.accountNumber || selected
      if(kind==='deposit') await api.deposit(account,{amount:Number(data.amount),description:data.description})
      if(kind==='withdraw') await api.withdraw(account,{amount:Number(data.amount),description:data.description})
      notify(kind==='deposit' ? 'Money deposited successfully' : 'Withdrawal completed')
      setModal(null); await load()
    } catch(e){notify(e.message,'error')} finally {setBusy(false)}
  }

  async function transfer(data){
    setBusy(true)
    try {
      await api.transfer({fromAccount:data.fromAccount,toAccount:data.toAccount,amount:Number(data.amount),description:data.description})
      notify('Transfer completed successfully'); setModal(null); await load()
    } catch(e){notify(e.message,'error')} finally {setBusy(false)}
  }

  const firstName = user?.fullName?.split(' ')[0] || 'Customer'

  return <div className="app-shell">
    <aside className={`sidebar ${mobileNav?'open':''}`}>
      <div className="sidebar-top"><Brand compact/><button className="icon-btn mobile-only" onClick={()=>setMobileNav(false)}><X/></button></div>
      <nav className="side-nav">
        <button className={view==='overview'?'active':''} onClick={()=>{setView('overview');setMobileNav(false)}}><Home/> Overview</button>
        <button className={view==='accounts'?'active':''} onClick={()=>{setView('accounts');setMobileNav(false)}}><WalletCards/> Accounts</button>
        <button className={view==='transactions'?'active':''} onClick={()=>{setView('transactions');setMobileNav(false)}}><History/> Transactions</button>
      </nav>
      <div className="side-bottom">
        <div className="security-pill"><ShieldCheck/><div><b>FinCore Secure</b><span>Protected session</span></div></div>
        <button className="logout-btn" onClick={logout}><LogOut/> Sign out</button>
      </div>
    </aside>

    <main className="dashboard-main">
      <header className="dash-header">
        <button className="icon-btn mobile-only" onClick={()=>setMobileNav(true)}><Menu/></button>
        <div className="dash-greeting"><span>Good morning, {firstName}</span><h1>{view==='overview'?'Financial overview':view==='accounts'?'Your accounts':'Transaction history'}</h1></div>
        <div className="dash-actions"><button className="icon-btn"><Bell size={20}/><i className="notification-dot"/></button><button className="profile-chip"><div className="avatar small">{user?.fullName?.split(' ').map(x=>x[0]).slice(0,2).join('') || 'FC'}</div><div><b>{user?.fullName}</b><span>{user?.role || 'CUSTOMER'}</span></div><ChevronDown size={15}/></button></div>
      </header>

      {loading ? <div className="loading-state"><div className="spinner"/><p>Loading your FinCore workspace…</p></div> : <>
        {view==='overview' && <>
          <section className="balance-hero">
            <div className="balance-copy"><div className="eyebrow light"><Sparkles size={14}/> TOTAL PORTFOLIO BALANCE</div><strong>{money(totalBalance)}</strong><p>Across {accounts.length} active {accounts.length===1?'account':'accounts'}</p><div className="hero-quick-actions"><button onClick={()=>setModal('transfer')}><Send/> Send money</button><button onClick={()=>setModal('deposit')}><ArrowDownLeft/> Deposit</button><button onClick={()=>setModal('withdraw')}><ArrowUpRight/> Withdraw</button></div></div>
            <div className="balance-art"><div className="orbital-ring ring-one"/><div className="orbital-ring ring-two"/><Landmark size={82}/></div>
          </section>

          <section className="metric-grid">
            <article><div className="metric-icon income"><ArrowDownLeft/></div><div><span>Incoming</span><strong>{money(incoming)}</strong><small>Selected account</small></div></article>
            <article><div className="metric-icon spending"><ArrowUpRight/></div><div><span>Outgoing</span><strong>{money(outgoing)}</strong><small>Selected account</small></div></article>
            <article><div className="metric-icon neutral"><CreditCard/></div><div><span>Active accounts</span><strong>{accounts.length}</strong><small>Savings & Current</small></div></article>
          </section>

          <section className="content-grid">
            <div className="panel accounts-panel">
              <div className="panel-head"><div><span className="section-kicker">YOUR ACCOUNTS</span><h2>Banking portfolio</h2></div><button className="btn btn-soft compact" onClick={()=>setModal('new-account')}><Plus size={16}/> Add account</button></div>
              <div className="account-card-scroll">
                {accounts.map((a,i)=><button key={a.accountNumber} className={`real-bank-card ${i%2?'pearl':'midnight'} ${selected===a.accountNumber?'selected':''}`} onClick={()=>setSelected(a.accountNumber)}>
                  <div className="card-top"><span>FINCORE</span><Building2 size={23}/></div><div className="card-type">{a.accountType} ACCOUNT</div><strong>{money(a.balance)}</strong><div className="card-number">•••• •••• •••• {last4(a.accountNumber)}</div><div className="card-foot"><span>{a.ownerName}</span><span>VIRTUAL</span></div>
                </button>)}
                {!accounts.length && <button className="empty-account" onClick={()=>setModal('new-account')}><Plus/><b>Create your first account</b><span>Choose Savings or Current</span></button>}
              </div>
            </div>

            <div className="panel activity-panel">
              <div className="panel-head"><div><span className="section-kicker">LATEST ACTIVITY</span><h2>Recent transactions</h2></div><button className="text-btn" onClick={()=>setView('transactions')}>View all <ArrowRight size={15}/></button></div>
              <TransactionList items={transactions.slice(0,5)} />
            </div>
          </section>
        </>}

        {view==='accounts' && <section className="page-panel">
          <div className="page-title-row"><div><p>Manage every FinCore account attached to your profile.</p></div><button className="btn btn-primary" onClick={()=>setModal('new-account')}><Plus size={17}/> Open account</button></div>
          <div className="account-management-grid">{accounts.map(a=><article className="manage-account" key={a.accountNumber}><div className="manage-account-top"><div className="feature-icon mini"><CreditCard/></div><span className="status-badge">ACTIVE</span></div><h3>{a.accountType} Account</h3><div className="manage-number">{a.accountNumber}</div><strong>{money(a.balance)}</strong><div className="manage-actions"><button onClick={()=>{setSelected(a.accountNumber);setModal('deposit')}}>Deposit</button><button onClick={()=>{setSelected(a.accountNumber);setModal('withdraw')}}>Withdraw</button><button onClick={()=>{setSelected(a.accountNumber);setModal('transfer')}}>Transfer</button></div></article>)}</div>
        </section>}

        {view==='transactions' && <section className="page-panel">
          <div className="transaction-toolbar"><div className="account-select"><label>Account</label><select value={selected} onChange={e=>setSelected(e.target.value)}>{accounts.map(a=><option key={a.accountNumber} value={a.accountNumber}>{a.accountType} •••• {last4(a.accountNumber)}</option>)}</select></div><div className="search-box"><Search size={18}/><input placeholder="Search description, reference…" value={query} onChange={e=>setQuery(e.target.value)}/></div><button className="icon-btn refresh" onClick={load}><RefreshCw size={18}/></button></div>
          <div className="transaction-table"><div className="tx-table-head"><span>Transaction</span><span>Reference</span><span>Balance after</span><span>Amount</span></div><TransactionList items={filtered} table/></div>
        </section>}
      </>}
    </main>

    {modal==='new-account' && <Modal title="Open a new account" subtitle="Choose the account type that fits your banking needs." onClose={()=>setModal(null)}><div className="account-choice"><button onClick={()=>createAccount('SAVINGS')} disabled={busy}><div className="choice-icon"><WalletCards/></div><div><b>Savings Account</b><span>For salary, savings and everyday money</span></div><ArrowRight/></button><button onClick={()=>createAccount('CURRENT')} disabled={busy}><div className="choice-icon"><Building2/></div><div><b>Current Account</b><span>Flexible account for frequent transactions</span></div><ArrowRight/></button></div></Modal>}
    {modal==='deposit' && <MoneyModal title="Deposit money" button="Deposit funds" accounts={accounts} selected={selected} busy={busy} icon={<ArrowDownLeft/>} onClose={()=>setModal(null)} onSubmit={d=>moneyAction('deposit',d)}/>} 
    {modal==='withdraw' && <MoneyModal title="Withdraw money" button="Confirm withdrawal" accounts={accounts} selected={selected} busy={busy} icon={<ArrowUpRight/>} onClose={()=>setModal(null)} onSubmit={d=>moneyAction('withdraw',d)}/>} 
    {modal==='transfer' && <TransferModal accounts={accounts} selected={selected} busy={busy} onClose={()=>setModal(null)} onSubmit={transfer}/>} 
    <Toast toast={toast} onClose={()=>setToast(null)}/>
  </div>
}

function TransactionList({items,table=false}){
  if(!items.length) return <div className="empty-state"><History size={32}/><b>No transactions yet</b><span>Your banking activity will appear here.</span></div>
  return <div className={table?'tx-table-body':'transaction-list'}>{items.map(t=>{const credit=['DEPOSIT','TRANSFER_IN'].includes(t.type);return <div className={`transaction-row ${table?'table-row':''}`} key={t.reference}><div className={`transaction-icon ${credit?'credit':'debit'}`}>{credit?<ArrowDownLeft/>:<ArrowUpRight/>}</div><div className="transaction-main"><b>{typeLabel(t.type)}</b><span>{t.description || 'FinCore transaction'}</span></div>{table&&<div className="tx-ref"><span>{String(t.reference).slice(0,8)}…</span><small>{new Date(t.createdAt).toLocaleDateString('en-IN')}</small></div>}{table&&<div className="tx-balance">{money(t.balanceAfter)}</div>}<div className={`transaction-amount ${credit?'positive':''}`}>{credit?'+':'-'}{money(t.amount)}</div></div>})}</div>
}

function MoneyModal({title,button,accounts,selected,busy,icon,onClose,onSubmit}){
  const [accountNumber,setAccountNumber]=useState(selected||accounts[0]?.accountNumber||'')
  const [amount,setAmount]=useState('')
  const [description,setDescription]=useState('')
  return <Modal title={title} subtitle="Enter the amount and a clear transaction description." onClose={onClose}><form className="modal-form" onSubmit={e=>{e.preventDefault();onSubmit({accountNumber,amount,description})}}><label>Account<select required value={accountNumber} onChange={e=>setAccountNumber(e.target.value)}>{accounts.map(a=><option value={a.accountNumber} key={a.accountNumber}>{a.accountType} •••• {last4(a.accountNumber)} — {money(a.balance)}</option>)}</select></label><label>Amount (₹)<div className="amount-input"><span>₹</span><input required min="0.01" step="0.01" type="number" value={amount} onChange={e=>setAmount(e.target.value)} placeholder="0.00"/></div></label><label>Description<input required value={description} onChange={e=>setDescription(e.target.value)} placeholder="e.g. Monthly salary"/></label><button className="btn btn-primary btn-full btn-lg" disabled={busy}>{busy?'Processing…':<>{icon}{button}</>}</button></form></Modal>
}

function TransferModal({accounts,selected,busy,onClose,onSubmit}){
  const [fromAccount,setFrom]=useState(selected||accounts[0]?.accountNumber||'')
  const [toAccount,setTo]=useState(accounts.find(a=>a.accountNumber!==fromAccount)?.accountNumber||'')
  const [amount,setAmount]=useState('')
  const [description,setDescription]=useState('Transfer between FinCore accounts')
  return <Modal title="Send money" subtitle="Transfer securely between your FinCore accounts." onClose={onClose}><form className="modal-form" onSubmit={e=>{e.preventDefault();onSubmit({fromAccount,toAccount,amount,description})}}><label>From account<select value={fromAccount} onChange={e=>setFrom(e.target.value)} required>{accounts.map(a=><option value={a.accountNumber} key={a.accountNumber}>{a.accountType} •••• {last4(a.accountNumber)} — {money(a.balance)}</option>)}</select></label><label>To account<select value={toAccount} onChange={e=>setTo(e.target.value)} required><option value="">Select destination</option>{accounts.filter(a=>a.accountNumber!==fromAccount).map(a=><option value={a.accountNumber} key={a.accountNumber}>{a.accountType} •••• {last4(a.accountNumber)}</option>)}</select></label><label>Amount (₹)<div className="amount-input"><span>₹</span><input required min="0.01" step="0.01" type="number" value={amount} onChange={e=>setAmount(e.target.value)} placeholder="0.00"/></div></label><label>Description<input required value={description} onChange={e=>setDescription(e.target.value)}/></label><button className="btn btn-primary btn-full btn-lg" disabled={busy||accounts.length<2}><Send size={18}/>{busy?'Sending…':'Send money'}</button>{accounts.length<2&&<div className="form-error">Create a second account before making an internal transfer.</div>}</form></Modal>
}
