import { useApp } from '../store.jsx'
import Avatar from '../components/Avatar.jsx'
import Constellation from '../components/Constellation.jsx'

const PERSONA_GOALS = { shirley: 'Product manager — growing her career with a 5-year-old', aesha: 'CTO — ready to mentor & share' }

export default function Login() {
  const { person, signIn } = useApp()
  return (
    <div className="screen nonav">
      <div className="login">
        <div className="login-hero">
          <Constellation variant="hero" />
          <div className="logo"><div className="mark">❦</div>NextChapter</div>
          <div className="tagline">12,400+ moms connected</div>
        </div>
        <h1>Every mom's <em>next chapter</em> starts with her people.</h1>
        <p className="muted" style={{ fontSize: 15, lineHeight: 1.5, marginBottom: 22 }}>
          Connect with working moms near you. Learn new skills, share what you know, and grow together.
        </p>
        <div className="field"><label>Email</label><input className="input" defaultValue="shirley@email.com" /></div>
        <div className="field"><label>Password</label><input className="input" type="password" defaultValue="demopass" /></div>
        <button className="btn primary" onClick={() => signIn('shirley')}>Sign in</button>
        <button className="btn ghost" style={{ marginTop: 10 }} onClick={() => signIn('shirley')}><b style={{ color: '#4285f4' }}>G</b> Continue with Google</button>
        <div className="divider">or explore as a demo persona</div>
        {['shirley', 'aesha'].map(id => {
          const p = person(id)
          return (
            <button key={id} className="card persona" onClick={() => signIn(id)}>
              <Avatar id={id} size={46} />
              <div style={{ flex: 1 }}>
                <b>{p.name}, {p.age}</b>
                <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>{p.situation} · {p.kids}</div>
                <div style={{ fontSize: 12, color: 'var(--plum-2)', marginTop: 2, fontWeight: 600 }}>{PERSONA_GOALS[id]}</div>
              </div>
            </button>
          )
        })}
        <p className="faint" style={{ fontSize: 12, textAlign: 'center', marginTop: 12 }}>New here? <b style={{ color: 'var(--plum)' }}>Create an account</b></p>
      </div>
    </div>
  )
}
