import { useApp } from '../store.jsx'
import { fmtDate } from '../data.js'
import Icon from '../components/Icon.jsx'
import Avatar from '../components/Avatar.jsx'
import EventCard from '../components/EventCard.jsx'

const CATS = ['All', 'Career', 'Upskill', 'Wellness', 'Hobby', 'Social']

export default function Discover() {
  const { S, me, ui, setUi, go, tab, toast, firstName, person } = useApp()
  const q = ui.q.trim().toLowerCase()
  const events = S.events.filter(e =>
    (!q || `${e.title} ${e.desc} ${e.cat} ${person(e.host).name}`.toLowerCase().includes(q)) &&
    (ui.cat === 'All' || e.cat === ui.cat) &&
    (ui.format === 'All' || e.format === ui.format) &&
    (ui.city === 'All' || e.city === ui.city) &&
    (ui.level === 'All' || e.level === ui.level) &&
    (!ui.kidOnly || e.kid)
  ).sort((a, b) => a.date.localeCompare(b.date))

  const activeFilters = [ui.format, ui.city, ui.level].filter(x => x !== 'All').length + (ui.kidOnly ? 1 : 0)
  const filtering = q || ui.cat !== 'All' || activeFilters
  const featured = S.events.find(e => e.id === (me === 'shirley' ? 'e1' : 'e7'))
  const hour = new Date().getHours()
  const greet = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  const Select = ({ k, opts }) => (
    <select value={ui[k]} onChange={e => setUi({ [k]: e.target.value })}>{opts.map(o => <option key={o}>{o}</option>)}</select>
  )

  return (
    <div className="screen">
      <div className="topbar">
        <div><div className="muted" style={{ fontSize: 13 }}>{greet},</div><h2>{firstName(me)} 👋</h2></div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="iconbtn" onClick={() => toast('🔔', 'Aesha posted a new event', 'Leadership Circle · Oct 22')}><Icon name="bell" /><span className="dot" /></button>
          <button onClick={() => tab('profile')}><Avatar id={me} size={40} /></button>
        </div>
      </div>

      <div className="search">
        <Icon name="search" />
        <input placeholder="Search events, skills, hosts…" value={ui.q} onChange={e => setUi({ q: e.target.value })} />
        <button className="iconbtn" style={{ width: 36, height: 36, border: 'none', background: activeFilters ? 'var(--plum)' : 'var(--plum-soft)', color: activeFilters ? '#fff' : 'var(--plum)' }}
          onClick={() => setUi({ showFilters: !ui.showFilters })}><Icon name="sliders" /></button>
      </div>

      {ui.showFilters && (
        <div className="card filters">
          <div className="row">
            <div><label className="fl">Format</label><Select k="format" opts={['All', 'Online', 'In person']} /></div>
            <div><label className="fl">Location</label><Select k="city" opts={['All', 'Online', 'Chicago', 'Evanston', 'Oak Park', 'Naperville']} /></div>
          </div>
          <div className="row">
            <div><label className="fl">Skill level</label><Select k="level" opts={['All', 'Beginner', 'Intermediate', 'Advanced', 'All levels']} /></div>
            <div><label className="fl">&nbsp;</label>
              <label className="check" style={{ margin: 0, height: 40, padding: '0 10px', fontSize: 13 }}>
                <input type="checkbox" checked={ui.kidOnly} onChange={e => setUi({ kidOnly: e.target.checked })} />Kid-friendly
              </label>
            </div>
          </div>
          <button className="btn sm ghost" style={{ width: '100%' }} onClick={() => setUi({ format: 'All', city: 'All', level: 'All', kidOnly: false, cat: 'All', q: '' })}>Clear all filters</button>
        </div>
      )}

      <div className="chips">{CATS.map(c => <button key={c} className={'chip' + (ui.cat === c ? ' on' : '')} onClick={() => setUi({ cat: c })}>{c}</button>)}</div>

      {!filtering && <>
        <div className="h-sec"><h3>Recommended for you</h3></div>
        <button className="featured" onClick={() => go('event', { id: featured.id })}>
          <small>{me === 'shirley' ? 'Matches your goal: Grow into leadership' : 'Your upcoming event'}</small>
          <h3>{featured.title}</h3>
          <p>{fmtDate(featured.date)} · {featured.time} · {featured.going} moms going</p>
        </button>
      </>}

      <div className="h-sec"><h3>{filtering ? 'Results' : 'Upcoming events & programs'}</h3><span>{events.length} found</span></div>
      {events.length ? events.map(e => <EventCard key={e.id} e={e} />) : (
        <div className="empty"><div>🔍</div>No events match. Try clearing a filter — or{' '}
          <b style={{ color: 'var(--plum)', cursor: 'pointer' }} onClick={() => tab('create')}>host one yourself</b>!</div>
      )}
    </div>
  )
}
