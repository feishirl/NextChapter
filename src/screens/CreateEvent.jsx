import { useState } from 'react'
import { useApp } from '../store.jsx'
import { EVENT_CATEGORIES, CITIES } from '../data.js'

const ICONS = ['💡', '📄', '📊', '🎨', '🌳', '🧸', '🧭', '🍳']

export default function CreateEvent() {
  const { publishEvent } = useApp()
  const [f, setF] = useState({ title: '', cat: 'Career', level: 'Beginner', format: 'Online', city: 'Chicago', date: '2026-10-27', time: '19:00', cap: 20, kid: true, desc: '', emoji: '💡' })
  const [err, setErr] = useState({})
  const set = patch => setF(prev => ({ ...prev, ...patch }))
  const Radio = ({ k, v, label }) => <button className={f[k] === v ? 'on' : ''} onClick={() => set({ [k]: v })}>{label || v}</button>

  function submit() {
    const errs = {}
    if (!f.title.trim()) errs.title = 'Give your event a title'
    if (!f.desc.trim()) errs.desc = 'Add a short description'
    setErr(errs)
    if (!Object.keys(errs).length) publishEvent(f)
  }

  return (
    <div className="screen">
      <div className="topbar"><h2>Host an event</h2></div>
      <div className="pad">
        <p className="muted" style={{ fontSize: 14, margin: '-6px 0 18px' }}>Share a skill, start a meetup, or teach what you know. Hosting earns <b style={{ color: 'var(--plum)' }}>+100 XP</b>.</p>
        <div className="field"><label>Pick an icon</label>
          <div className="emoji-pick">{ICONS.map(x => <button key={x} className={f.emoji === x ? 'on' : ''} onClick={() => set({ emoji: x })}>{x}</button>)}</div></div>
        <div className="field"><label>Event title</label>
          <input className="input" placeholder="e.g. Negotiating Your Return-to-Work Offer" value={f.title} onChange={e => set({ title: e.target.value })} />
          {err.title && <div className="err">{err.title}</div>}</div>
        <div className="field"><label>Category</label>
          <select className="input" value={f.cat} onChange={e => set({ cat: e.target.value })}>{EVENT_CATEGORIES.map(o => <option key={o}>{o}</option>)}</select></div>
        <div className="field"><label>Skill level</label>
          <div className="radio-row"><Radio k="level" v="Beginner" /><Radio k="level" v="Intermediate" label="Intermed." /><Radio k="level" v="Advanced" /></div></div>
        <div className="field"><label>Format</label>
          <div className="radio-row"><Radio k="format" v="Online" /><Radio k="format" v="In person" /></div></div>
        {f.format === 'In person' && (
          <div className="field"><label>Location</label>
            <select className="input" value={f.city} onChange={e => set({ city: e.target.value })}>{CITIES.map(o => <option key={o}>{o}</option>)}</select></div>
        )}
        <div className="row">
          <div className="field"><label>Date</label><input className="input" type="date" value={f.date} onChange={e => set({ date: e.target.value })} /></div>
          <div className="field"><label>Time</label><input className="input" type="time" value={f.time} onChange={e => set({ time: e.target.value })} /></div>
        </div>
        <div className="field"><label>Capacity</label><input className="input" type="number" min="2" value={f.cap} onChange={e => set({ cap: e.target.value })} /></div>
        <label className="check"><input type="checkbox" checked={f.kid} onChange={e => set({ kid: e.target.checked })} />Kid-friendly (little ones welcome)</label>
        <div className="field"><label>Description</label>
          <textarea className="input" placeholder="What will moms learn or do?" value={f.desc} onChange={e => set({ desc: e.target.value })} />
          {err.desc && <div className="err">{err.desc}</div>}</div>
        <button className="btn coral" onClick={submit}>Publish event</button>
      </div>
    </div>
  )
}
