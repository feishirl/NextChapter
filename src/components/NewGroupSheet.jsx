import { useState } from 'react'
import { useApp } from '../store.jsx'
import Avatar from './Avatar.jsx'

const EMOJIS = ['💜', '☕', '🚀', '📚', '🧘', '🍼', '💼', '🌎']

export default function NewGroupSheet() {
  const { connected, person, closeSheet, createGroup } = useApp()
  const [f, setF] = useState({ name: '', emoji: '💜', desc: '', invite: [] })
  const [err, setErr] = useState(false)
  const set = patch => setF(prev => ({ ...prev, ...patch }))
  const toggleInvite = id => set({ invite: f.invite.includes(id) ? f.invite.filter(x => x !== id) : [...f.invite, id] })
  const friends = connected()

  return (
    <div className="sheet-bg" onClick={e => e.target === e.currentTarget && closeSheet()}>
      <div className="sheet">
        <div className="grab" />
        <h3>New custom group</h3>
        <div className="field"><label>Icon</label>
          <div className="emoji-pick">{EMOJIS.map(x => <button key={x} className={f.emoji === x ? 'on' : ''} onClick={() => set({ emoji: x })}>{x}</button>)}</div>
        </div>
        <div className="field"><label>Group name</label>
          <input className="input" autoFocus placeholder="e.g. Lakeview Moms Learning Data" value={f.name} onChange={e => { set({ name: e.target.value }); setErr(false) }} />
          {err && <div className="err">Give your group a name</div>}
        </div>
        <div className="field"><label>What's it about?</label>
          <input className="input" placeholder="Weekly accountability for career changers" value={f.desc} onChange={e => set({ desc: e.target.value })} />
        </div>
        <div className="field"><label>Invite connections</label>
          {friends.length ? friends.map(id => (
            <label key={id} className="check" style={{ marginBottom: 8 }}>
              <Avatar id={id} size={30} /><span style={{ flex: 1 }}>{person(id).name}</span>
              <input type="checkbox" checked={f.invite.includes(id)} onChange={() => toggleInvite(id)} />
            </label>
          )) : <div className="faint" style={{ fontSize: 13 }}>Connect with moms to invite them.</div>}
        </div>
        <button className="btn coral" onClick={() => f.name.trim() ? createGroup(f) : setErr(true)}>Create group</button>
      </div>
    </div>
  )
}
