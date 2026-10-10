import { useApp } from '../store.jsx'
import { BADGES, XP_PER_LEVEL, lvl, levelName } from '../data.js'
import Icon from '../components/Icon.jsx'
import Avatar from '../components/Avatar.jsx'

export default function Profile() {
  const { S, me, person, prog, connected, go, signOut, setPhoto } = useApp()
  const p = person(me), pr = prog(), L = lvl(pr.xp), into = pr.xp % XP_PER_LEVEL
  const conns = connected().length
  const communities = pr.joined.length + S.customGroups.filter(g => g.members.includes(me)).length
  // Weekly goals compare against each persona's starting point so they tick off during the demo.
  const goals = [
    { t: 'Sign up for an event', ok: pr.regs.length > (me === 'yuri' ? 0 : 1) },
    { t: 'Message a mom 1:1 or in a group', ok: pr.badges.includes('ice') && Object.values(S.threads).some(t => t.some(m => m.from === me && m.t === 'now')) },
    { t: 'Make a new connection', ok: conns > (me === 'yuri' ? 1 : 3) },
    { t: 'Join a new community', ok: communities > (me === 'yuri' ? 1 : 3) }
  ]

  function onPhoto(e) {
    const file = e.target.files[0]
    if (!file) return
    const r = new FileReader()
    r.onload = () => setPhoto(r.result)
    r.readAsDataURL(file)
  }

  return (
    <div className="screen">
      <div className="cover"><div className="tools">
        <button className="iconbtn" onClick={() => go('editProfile')} aria-label="Edit profile"><Icon name="edit" /></button>
        <button className="iconbtn" onClick={signOut} aria-label="Sign out"><Icon name="logout" /></button>
      </div></div>
      <div className="pf-head">
        <div className="pf-av"><Avatar id={me} size={104} />
          <label title="Change photo"><Icon name="camera" sm /><input type="file" accept="image/*" hidden onChange={onPhoto} /></label></div>
        <h1>{p.name}</h1>
        <div className="muted" style={{ fontSize: 14, display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}><Icon name="pin" sm /> {p.hood}, {p.city} · {p.situation}</div>
        <p style={{ fontSize: 14, lineHeight: 1.5, marginTop: 10 }}>{p.bio}</p>
      </div>

      <div className="card stats">
        <div><b>{pr.regs.length}</b><span>Events</span></div>
        <div><b>{conns}</b><span>Connections</span></div>
        <div><b>{communities}</b><span>Communities</span></div>
      </div>

      <div className="level">
        <div className="top">
          <div>
            <div className="faint" style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em' }}>Your progress</div>
            <div style={{ fontFamily: 'Fraunces,serif', fontSize: 21, color: 'var(--plum)', marginTop: 2 }}>{levelName(L)}</div>
          </div>
          <div className="lvl-badge">{L}</div>
        </div>
        <div className="bar"><i style={{ width: `${(into / XP_PER_LEVEL) * 100}%` }} /></div>
        <div className="muted" style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
          <span><b>{pr.xp} XP</b></span><span>{XP_PER_LEVEL - into} XP to Level {L + 1}</span>
        </div>
        <div style={{ marginTop: 14, fontSize: 13, fontWeight: 700 }}>This week's goals</div>
        {goals.map(g => (
          <div key={g.t} className={'goal' + (g.ok ? ' ok' : '')}><div className="cb">{g.ok && <Icon name="check" sm />}</div><span>{g.t}</span></div>
        ))}
      </div>

      <div className="h-sec"><h3>Badges</h3><span>{pr.badges.length} of {BADGES.length}</span></div>
      <div className="badges">
        {BADGES.map(b => <div key={b.id} className={'bdg' + (pr.badges.includes(b.id) ? '' : ' locked')}><div className="e">{b.e}</div>{b.n}</div>)}
      </div>

      <div className="h-sec"><h3>About</h3></div>
      <div className="card about">
        <div className="r"><span className="ic"><Icon name="brief" sm /></span><span>{p.career}</span></div>
        <div className="r"><span className="ic"><Icon name="smile" sm /></span><span>{p.kids}</span></div>
        <div className="r"><span className="ic"><Icon name="heart" sm /></span>
          <span style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>{p.hobbies.map(h => <span key={h} className="tag plum">{h}</span>)}</span></div>
        <div className="r"><span className="ic"><Icon name="layers" sm /></span><span>Interested in: {p.interests.join(', ')}</span></div>
      </div>
    </div>
  )
}
