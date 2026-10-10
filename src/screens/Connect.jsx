import { useApp } from '../store.jsx'
import Icon from '../components/Icon.jsx'
import Avatar from '../components/Avatar.jsx'

function PersonCard({ id, showMatch }) {
  const { person, prog, matchInfo, go, accept, decline, openDM, connectTo } = useApp()
  const p = person(id), m = matchInfo(id), s = prog().conns[id]
  let actions
  if (s === 'incoming') actions = <div className="row"><button className="btn sm ghost" onClick={() => decline(id)}>Decline</button><button className="btn sm primary" onClick={() => accept(id)}>Accept</button></div>
  else if (s === 'connected') actions = <div className="row"><button className="btn sm ghost" onClick={() => go('person', { id })}>View profile</button><button className="btn sm primary" onClick={() => openDM(id)}><Icon name="chat" sm /> Message</button></div>
  else if (s === 'pending') actions = <button className="btn sm pending" style={{ width: '100%' }}>Request sent</button>
  else actions = <button className="btn sm primary" style={{ width: '100%' }} onClick={() => connectTo(id)}><Icon name="userplus" sm /> Connect</button>

  return (
    <div className="card person">
      <div className="top">
        <button onClick={() => go('person', { id })}><Avatar id={id} size={52} /></button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <b>{p.name}, {p.age}</b>
          <div className="muted" style={{ fontSize: 12 }}>{p.career}</div>
          <div className="faint" style={{ fontSize: 12 }}>{p.city} · {p.kids}</div>
        </div>
        {showMatch && <span className="match">{m.score}%</span>}
      </div>
      {showMatch && m.reasons.length
        ? <div className="reasons">{m.reasons.map(([c, r]) => <span key={r} className={'tag ' + c}>{r}</span>)}</div>
        : <div style={{ height: 12 }} />}
      {actions}
    </div>
  )
}

export default function Connect() {
  const { S, me, ui, setUi, prog, person, matchInfo } = useApp()
  const conns = prog().conns, q = ui.connQ.toLowerCase(), t = ui.connTab
  const others = Object.keys(S.people).filter(id => id !== me && (!q || `${person(id).name} ${person(id).career} ${person(id).city}`.toLowerCase().includes(q)))
  const incoming = others.filter(id => conns[id] === 'incoming')
  const list = t === 'suggested'
    ? others.filter(id => !conns[id] || conns[id] === 'pending').sort((a, b) => matchInfo(b).score - matchInfo(a).score)
    : t === 'requests' ? incoming : others.filter(id => conns[id] === 'connected')
  const T = ({ id, label }) => <button className={t === id ? 'on' : ''} onClick={() => setUi({ connTab: id })}>{label}</button>

  return (
    <div className="screen">
      <div className="topbar"><h2>Find your people</h2></div>
      <div className="search"><Icon name="search" /><input placeholder="Search by name, career, city…" value={ui.connQ} onChange={e => setUi({ connQ: e.target.value })} /></div>
      <div className="seg" style={{ marginBottom: 14 }}>
        <T id="suggested" label="Suggested" /><T id="requests" label={`Requests${incoming.length ? ` (${incoming.length})` : ''}`} /><T id="circle" label="My circle" />
      </div>
      {list.length ? list.map(id => <PersonCard key={id} id={id} showMatch={t === 'suggested'} />)
        : <div className="empty"><div>🤝</div>{t === 'requests' ? 'No pending requests' : 'Nothing here yet'}</div>}
    </div>
  )
}
