import { useState } from 'react'
import { useApp } from '../store.jsx'
import { SITUATIONS } from '../data.js'
import Icon from '../components/Icon.jsx'

const HOBBIES = ['Yoga', 'Baking', 'Podcasts', 'Running', 'Book club', 'Gardening', 'Crafts', 'Travel', 'Cooking', 'Photography']
const INTERESTS = ['Upskill', 'Career', 'Mentoring', 'Entrepreneurship', 'Wellness', 'Parenting', 'Friendship']

export default function EditProfile() {
  const { me, person, back, saveProfile } = useApp()
  const p = person(me)
  const [f, setF] = useState({ name: p.name, hood: p.hood, city: p.city, situation: p.situation, career: p.career, kids: p.kids, bio: p.bio, hobbies: [...p.hobbies], interests: [...p.interests] })
  const set = patch => setF(prev => ({ ...prev, ...patch }))
  const toggle = (k, v) => set({ [k]: f[k].includes(v) ? f[k].filter(x => x !== v) : [...f[k], v] })
  const input = (k, label) => (
    <div className="field"><label>{label}</label><input className="input" value={f[k]} onChange={e => set({ [k]: e.target.value })} /></div>
  )

  return (
    <div className="screen nonav">
      <div className="topbar">
        <button className="iconbtn" onClick={back} aria-label="Cancel"><Icon name="x" /></button>
        <h2 style={{ flex: 1, fontSize: 21 }}>Edit profile</h2>
        <button className="btn sm primary" onClick={() => saveProfile(f)}>Save</button>
      </div>
      <div className="pad">
        {input('name', 'Name')}
        <div className="row">{input('hood', 'Neighborhood')}{input('city', 'City')}</div>
        <div className="field"><label>I am a…</label>
          <select className="input" value={f.situation} onChange={e => set({ situation: e.target.value })}>{SITUATIONS.map(o => <option key={o}>{o}</option>)}</select></div>
        {input('career', 'Career')}
        {input('kids', 'Children')}
        <div className="field"><label>Bio</label><textarea className="input" value={f.bio} onChange={e => set({ bio: e.target.value })} /></div>
        <div className="field"><label>Hobbies</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>{HOBBIES.map(h => <button key={h} className={'chip' + (f.hobbies.includes(h) ? ' on' : '')} onClick={() => toggle('hobbies', h)}>{h}</button>)}</div></div>
        <div className="field"><label>I'm here for…</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>{INTERESTS.map(h => <button key={h} className={'chip' + (f.interests.includes(h) ? ' on' : '')} onClick={() => toggle('interests', h)}>{h}</button>)}</div></div>
      </div>
    </div>
  )
}
