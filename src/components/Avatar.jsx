import { useApp } from '../store.jsx'

export default function Avatar({ id, size = 44 }) {
  const p = useApp().person(id)
  const style = { width: size, height: size }
  if (p.photo) return <div className="avatar" style={{ ...style, backgroundImage: `url(${p.photo})` }} />
  const initials = p.name.split(' ').map(w => w[0]).join('').slice(0, 2)
  return <div className="avatar" style={{ ...style, background: p.color, fontSize: Math.round(size * 0.38) }}>{initials}</div>
}
