import { useApp } from '../store.jsx'
import Icon from '../components/Icon.jsx'
import Avatar from '../components/Avatar.jsx'
import EventCard from '../components/EventCard.jsx'

export default function PersonView() {
  const { S, view, person, prog, matchInfo, back, openDM, connectTo, accept } = useApp()
  const id = view.id, p = person(id), s = prog().conns[id], m = matchInfo(id)
  const hosting = S.events.filter(e => e.host === id)

  let action
  if (s === 'connected') action = <button className="btn primary" onClick={() => openDM(id)}><Icon name="chat" /> Message</button>
  else if (s === 'pending') action = <button className="btn pending">Request sent</button>
  else if (s === 'incoming') action = <button className="btn primary" onClick={() => accept(id)}>Accept request</button>
  else action = <button className="btn primary" onClick={() => connectTo(id)}><Icon name="userplus" /> Connect</button>

  return (
    <div className="screen nonav">
      <div className="cover" style={{ background: `linear-gradient(120deg, ${p.color}55, ${p.color})` }}>
        <button className="iconbtn" style={{ position: 'absolute', top: 10, left: 16, background: 'rgba(255,255,255,.85)', border: 'none' }} onClick={back}><Icon name="back" /></button>
      </div>
      <div className="pf-head">
        <div className="pf-av"><Avatar id={id} size={104} /></div>
        <h1>{p.name}, {p.age}</h1>
        <div className="muted" style={{ fontSize: 14 }}>{p.city} · {p.situation}</div>
        {p.bio && <p style={{ fontSize: 14, lineHeight: 1.5, marginTop: 10 }}>{p.bio}</p>}
        <div className="reasons">{m.reasons.map(([c, r]) => <span key={r} className={'tag ' + c}>{r}</span>)}</div>
        {action}
      </div>
      <div className="h-sec"><h3>About</h3></div>
      <div className="card about">
        <div className="r"><span className="ic"><Icon name="brief" sm /></span><span>{p.career}</span></div>
        <div className="r"><span className="ic"><Icon name="smile" sm /></span><span>{p.kids}</span></div>
        <div className="r"><span className="ic"><Icon name="heart" sm /></span>
          <span style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>{p.hobbies.map(h => <span key={h} className="tag plum">{h}</span>)}</span></div>
      </div>
      {hosting.length > 0 && <><div className="h-sec"><h3>Hosting</h3></div>{hosting.map(e => <EventCard key={e.id} e={e} />)}</>}
    </div>
  )
}
