import { useApp } from '../store.jsx'
import { PAST_EVENTS } from '../data.js'
import Icon from '../components/Icon.jsx'
import Avatar from '../components/Avatar.jsx'

function PersonCard({ id, tab }) {
  const { person, prog, matchInfo, go, accept, decline, openDM, connectTo } = useApp()
  const p = person(id), m = matchInfo(id), s = prog().conns[id]
  let actions
  if (s === 'incoming') actions = <div className="row"><button className="btn sm ghost" onClick={() => decline(id)}>Not now</button><button className="btn sm primary" onClick={() => accept(id)}>💜 Accept</button></div>
  else if (s === 'connected') actions = <div className="row"><button className="btn sm ghost" onClick={() => go('person', { id })}>View profile</button><button className="btn sm primary" onClick={() => openDM(id)}><Icon name="chat" sm /> Say hi</button></div>
  else if (s === 'pending') actions = <button className="btn sm pending" style={{ width: '100%' }}>💌 Request sent</button>
  else actions = <button className="btn sm primary" style={{ width: '100%' }} onClick={() => connectTo(id)}>💜 Connect</button>

  const reasons = tab === 'suggested' ? m.reasons.slice(0, 3) : m.reasons.filter(([c]) => c === 'gold')
  return (
    <div className="card person">
      <div className="top">
        <button onClick={() => go('person', { id })}><Avatar id={id} size={52} /></button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <b>{p.name}</b>
          <div className="muted" style={{ fontSize: 12 }}>{p.career}</div>
          <div className="faint" style={{ fontSize: 12 }}>📍 {p.city}</div>
        </div>
        {tab === 'suggested' && <span className="match">{m.score}% match</span>}
      </div>
      {reasons.length
        ? <div className="reasons">{reasons.map(([c, r]) => <span key={r} className={'tag ' + c}>{r}</span>)}</div>
        : <div style={{ height: 12 }} />}
      {actions}
    </div>
  )
}

export default function Connect() {
  const { S, me, ui, setUi, prog, person, matchInfo } = useApp()
  const conns = prog().conns, q = ui.connQ.toLowerCase(), t = ui.connTab
  const myEvents = PAST_EVENTS.filter(e => (person(me).attended || []).includes(e.id))
  const others = Object.keys(S.people).filter(id => id !== me && (!q || `${person(id).name} ${person(id).career} ${person(id).city}`.toLowerCase().includes(q)))
  const incoming = others.filter(id => conns[id] === 'incoming')
  const friends = others.filter(id => conns[id] === 'connected')

  // "From my events" filter: everyone who went to any of my past events, or one specific event.
  const ev = ui.connEvent
  const fromEvents = id => matchInfo(id).sharedEvents.some(e => ev === 'any' || e.id === ev)
  const suggested = others
    .filter(id => !conns[id] || conns[id] === 'pending')
    .filter(id => ev === 'all' || fromEvents(id))
    .sort((a, b) => matchInfo(b).score - matchInfo(a).score)
  const metAtEvents = others.filter(id => !conns[id] && matchInfo(id).sharedEvents.length).length

  const list = t === 'suggested' ? suggested : t === 'requests' ? incoming : friends
  const T = ({ id, label }) => <button className={t === id ? 'on' : ''} onClick={() => setUi({ connTab: id })}>{label}</button>
  const empty = {
    suggested: 'No one here yet — try another event or clear the filter.',
    requests: 'No requests right now. Go say hi to someone new!',
    friends: 'Your friends will show up here. Start by connecting with a mom from an event you went to 💜'
  }[t]

  return (
    <div className="screen">
      <div className="topbar"><div>
        <h2>Find your people 💜</h2>
        <div className="muted" style={{ fontSize: 13, marginTop: 2 }}>Grow together and cheer each other on.</div>
      </div></div>
      <div className="search"><Icon name="search" /><input placeholder="Search by name, work, city…" value={ui.connQ} onChange={e => setUi({ connQ: e.target.value })} /></div>
      <div className="seg" style={{ marginBottom: 12 }}>
        <T id="suggested" label="Suggested" />
        <T id="requests" label={`Requests${incoming.length ? ` (${incoming.length})` : ''}`} />
        <T id="friends" label={`💜 Friends${friends.length ? ` (${friends.length})` : ''}`} />
      </div>

      {t === 'suggested' && <>
        <div className="chips" style={{ marginBottom: 12 }}>
          <button className={'chip' + (ev === 'all' ? ' on' : '')} onClick={() => setUi({ connEvent: 'all' })}>Everyone</button>
          <button className={'chip' + (ev === 'any' ? ' on' : '')} onClick={() => setUi({ connEvent: 'any' })}>🎟️ From my events</button>
          {myEvents.map(e => (
            <button key={e.id} className={'chip' + (ev === e.id ? ' on' : '')} onClick={() => setUi({ connEvent: e.id })}>{e.emoji} {e.title}</button>
          ))}
        </div>
        {ev === 'all' && metAtEvents > 0 && (
          <button className="card welcome-banner" onClick={() => setUi({ connEvent: 'any' })}>
            <div style={{ fontSize: 28 }}>🎟️</div>
            <div style={{ flex: 1, textAlign: 'left' }}>
              <b>{metAtEvents} women went to events with you</b>
              <div className="muted" style={{ fontSize: 12 }}>You've already shared a room — say hi!</div>
            </div>
            <Icon name="back" />
          </button>
        )}
      </>}

      {list.length ? list.map(id => <PersonCard key={id} id={id} tab={t} />)
        : <div className="empty"><div>{t === 'friends' ? '💜' : '🤝'}</div>{empty}</div>}
    </div>
  )
}
