import { useState } from 'react'
import { useApp } from '../store.jsx'
import { fmtDate, SITUATIONS } from '../data.js'
import Icon from '../components/Icon.jsx'

export default function Signup() {
  const { S, me, view, person, back, registerEvent } = useApp()
  const e = S.events.find(x => x.id === view.id)
  const p = person(me)
  const [f, setF] = useState({ name: p.name.replace('.', ''), email: me + '@email.com', sit: p.situation, exp: 'Beginner', care: false, note: '' })
  const [err, setErr] = useState({})
  const set = patch => setF(prev => ({ ...prev, ...patch }))

  function submit() {
    const errs = {}
    if (!f.name.trim()) errs.name = 'Please enter your name'
    if (!/^\S+@\S+\.\S+$/.test(f.email)) errs.email = 'Please enter a valid email'
    setErr(errs)
    if (!Object.keys(errs).length) registerEvent(e.id)
  }

  return (
    <div className="screen nonav">
      <div className="topbar"><button className="iconbtn" onClick={back}><Icon name="back" /></button><h2 style={{ flex: 1, fontSize: 21 }}>Sign up</h2></div>
      <div className="pad">
        <div className="card" style={{ display: 'flex', gap: 12, alignItems: 'center', padding: 12, marginBottom: 18 }}>
          <div className="grp-av" style={{ background: e.bg }}>{e.emoji}</div>
          <div><b style={{ fontSize: 14 }}>{e.title}</b><div className="muted" style={{ fontSize: 12 }}>{fmtDate(e.date)} · {e.time}</div></div>
        </div>
        <div className="field"><label>Full name</label><input className="input" value={f.name} onChange={x => set({ name: x.target.value })} />{err.name && <div className="err">{err.name}</div>}</div>
        <div className="field"><label>Email</label><input className="input" value={f.email} onChange={x => set({ email: x.target.value })} />{err.email && <div className="err">{err.email}</div>}</div>
        <div className="field"><label>I am currently a…</label>
          <select className="input" value={f.sit} onChange={x => set({ sit: x.target.value })}>{SITUATIONS.map(o => <option key={o}>{o}</option>)}</select></div>
        <div className="field"><label>My experience with this topic</label>
          <div className="radio-row">{['Beginner', 'Some', 'Experienced'].map(v => <button key={v} className={f.exp === v ? 'on' : ''} onClick={() => set({ exp: v })}>{v}</button>)}</div></div>
        <label className="check"><input type="checkbox" checked={f.care} onChange={x => set({ care: x.target.checked })} />My child may join me on camera / on-site</label>
        <div className="field"><label>Anything the host should know? <span className="faint">(optional)</span></label>
          <textarea className="input" placeholder="e.g. I've been home for 4 years and want to get back into marketing" value={f.note} onChange={x => set({ note: x.target.value })} /></div>
        <button className="btn coral" onClick={submit}>Confirm my spot</button>
        <p className="faint" style={{ fontSize: 12, textAlign: 'center', marginTop: 10 }}>You'll get a reminder 1 hour before.</p>
      </div>
    </div>
  )
}
