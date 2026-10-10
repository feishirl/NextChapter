import { useApp } from '../store.jsx'
import { fmtDate } from '../data.js'
import Icon from '../components/Icon.jsx'
import Avatar from '../components/Avatar.jsx'

export default function EventDetail() {
  const { S, me, view, prog, person, go, back, toast, connectTo, openDM } = useApp()
  const e = S.events.find(x => x.id === view.id)
  const host = person(e.host)
  const going = prog().regs.includes(e.id), mine = e.host === me, left = e.cap - e.going
  const conn = prog().conns[e.host]
  const attendees = ['maria', 'dana', 'nia', 'jen', 'priya', 'lauren'].filter(x => x !== e.host && x !== me).slice(0, 4)
  const online = e.format === 'Online'

  let hostAction = null
  if (!mine) hostAction = conn === 'connected'
    ? <button className="btn sm ghost" onClick={() => openDM(e.host)}><Icon name="chat" sm /></button>
    : <button className={'btn sm ' + (conn === 'pending' ? 'pending' : 'ghost')} onClick={() => connectTo(e.host)}>{conn === 'pending' ? 'Requested' : <Icon name="userplus" sm />}</button>

  return (
    <div className="screen nonav">
      <div className="hero" style={{ background: e.bg }}><button className="iconbtn back" onClick={back}><Icon name="back" /></button>{e.emoji}</div>
      <div className="detail">
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <span className="tag plum">{e.cat}</span><span className="tag gold">{e.level}</span>
          {e.kid && <span className="tag sage">👶 Kid-friendly</span>}
        </div>
        <h1>{e.title}</h1>
        <div className="inforow"><div className="ic"><Icon name="cal" /></div><div><b>{fmtDate(e.date)}</b><span>{e.time} · {e.dur}</span></div></div>
        <div className="inforow"><div className="ic"><Icon name={online ? 'video' : 'pin'} /></div>
          <div><b>{online ? 'Online (Zoom link after sign-up)' : e.city}</b><span>{online ? 'Join from anywhere' : 'Exact address shared after sign-up'}</span></div></div>
        <div className="inforow"><div className="ic"><Icon name="users" /></div>
          <div><b>{e.going} going · {left > 0 ? `${left} spots left` : 'Waitlist'}</b><span>Capacity {e.cap}</span></div>
          <div className="stack" style={{ marginLeft: 'auto' }}>{attendees.map(a => <Avatar key={a} id={a} size={30} />)}</div></div>
        <div className="card host">
          <Avatar id={e.host} size={46} />
          <div style={{ flex: 1 }}><div className="faint" style={{ fontSize: 12 }}>Hosted by</div><b>{host.name}</b><div className="muted" style={{ fontSize: 12 }}>{host.career}</div></div>
          {hostAction}
        </div>
        <h3 style={{ fontSize: 16, marginBottom: 6 }}>About this event</h3>
        <p className="desc">{e.desc}</p>
        <h3 style={{ fontSize: 16, margin: '18px 0 0' }}>What you'll get</h3>
        <ul>{e.learn.map(l => <li key={l}>{l}</li>)}</ul>
      </div>
      <div className="sticky">
        {mine ? <button className="btn ghost" onClick={() => toast('📣', 'Shared with your communities', 'Returning to Work · 40+ and Thriving')}>Share with my communities</button>
          : going ? <button className="btn done"><Icon name="check" /> You're going!</button>
          : <button className="btn coral" onClick={() => go('signup', { id: e.id })}>Sign up — it's free</button>}
      </div>
    </div>
  )
}
