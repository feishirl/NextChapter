import { useApp } from '../store.jsx'

export default function Toast() {
  const t = useApp().toastState
  if (!t) return null
  return (
    <div className="toast" key={t.id}>
      <div className="e">{t.e}</div>
      <div><b>{t.title}</b>{t.sub && <small>{t.sub}</small>}</div>
    </div>
  )
}
