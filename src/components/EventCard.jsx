import { useApp } from '../store.jsx'
import { shortDate } from '../data.js'
import Icon from './Icon.jsx'

export default function EventCard({ e }) {
  const { me, prog, person, go } = useApp()
  const going = prog().regs.includes(e.id), mine = e.host === me
  return (
    <button className="card ev" onClick={() => go('event', { id: e.id })}>
      <div className="thumb" style={{ background: e.bg }}>{e.emoji}<div className="date">{shortDate(e.date)}</div></div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <h4>{e.title}</h4>
        <div className="meta"><Icon name={e.format === 'Online' ? 'video' : 'pin'} sm /> {e.format === 'Online' ? 'Online' : e.city} · {e.time}</div>
        <div className="meta"><Icon name="user" sm /> Hosted by {person(e.host).name}</div>
        <div className="tags">
          <span className="tag plum">{e.cat}</span>
          <span className="tag gold">{e.level}</span>
          {going && <span className="tag sage">✓ Going</span>}
          {mine && <span className="tag coral">Your event</span>}
        </div>
      </div>
    </button>
  )
}
