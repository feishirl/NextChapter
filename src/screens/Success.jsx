import { useApp } from '../store.jsx'
import { fmtDate } from '../data.js'
import Icon from '../components/Icon.jsx'

export default function Success() {
  const { S, me, view, prog, firstName, toast, connectTo, tab, openThread } = useApp()
  const e = S.events.find(x => x.id === view.id)
  const conn = prog().conns[e.host]
  return (
    <div className="screen nonav">
      <div className="success">
        <div className="big">🎉</div>
        <h1>You're in!</h1>
        <p className="muted" style={{ lineHeight: 1.5 }}>{e.title}<br /><b>{fmtDate(e.date)} · {e.time}</b></p>
        <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button className="btn primary" onClick={() => toast('📅', 'Added to your calendar', 'Reminder set for 1 hour before')}><Icon name="cal" /> Add to calendar</button>
          {conn !== 'connected' && e.host !== me && (
            <button className="btn ghost" onClick={() => connectTo(e.host)}><Icon name="userplus" /> {conn === 'pending' ? 'Request sent to' : 'Connect with'} {firstName(e.host)}</button>
          )}
          <button className="btn ghost" onClick={() => tab('discover')}>Back to Discover</button>
        </div>
        <div className="card" style={{ marginTop: 24, padding: 14, textAlign: 'left', display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{ fontSize: 28 }}>💡</div>
          <div style={{ fontSize: 13 }} className="muted"><b style={{ color: 'var(--ink)' }}>{e.going - 1} moms are going.</b> Say hi in the{' '}
            <b style={{ color: 'var(--plum)', cursor: 'pointer' }} onClick={() => openThread('g_return')}>Returning to Work</b> community before the event!</div>
        </div>
      </div>
    </div>
  )
}
