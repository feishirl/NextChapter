import { useEffect, useRef, useState } from 'react'
import { useApp } from '../store.jsx'
import Icon from '../components/Icon.jsx'
import Avatar from '../components/Avatar.jsx'

const QUICK_GROUP = ['Hi everyone! 👋', 'Anyone going to the next event?', 'Any tips for getting back to work?']
const QUICK_DM = ['Hi! Loved your event description 😊', 'Could I ask you about returning to work?', 'Coffee sometime?']

export default function Thread() {
  const { S, me, view, typing, groupById, person, back, sendMsg } = useApp()
  const [text, setText] = useState('')
  const listRef = useRef()
  const { key, group, other } = view
  const msgs = S.threads[key] || []
  const isTyping = typing && typing.key === key

  useEffect(() => { listRef.current.scrollTop = listRef.current.scrollHeight }, [msgs.length, isTyping])

  let title, sub, av
  if (group) {
    const g = groupById(key)
    title = g.name
    sub = `${Array.isArray(g.members) ? g.members.length : g.members.toLocaleString()} members`
    av = <div className="grp-av" style={{ width: 40, height: 40, fontSize: 20, background: g.bg }}>{g.emoji}</div>
  } else {
    const p = person(other)
    title = p.name
    sub = `${p.situation} · ${p.city}`
    av = <Avatar id={other} size={40} />
  }

  const send = t => { sendMsg(key, t, { group, other }); setText('') }

  return (
    <div className="thread">
      <div className="thread-head">
        <button className="iconbtn" onClick={back}><Icon name="back" /></button>{av}
        <div style={{ flex: 1, minWidth: 0 }}><b style={{ fontSize: 15 }}>{title}</b><div className="faint" style={{ fontSize: 12 }}>{sub}</div></div>
      </div>
      <div className="msgs" ref={listRef}>
        <div className="daysep">{group ? 'Community guidelines: be kind, be supportive 💜' : 'You are connected'}</div>
        {msgs.map((m, i) => {
          const mine = m.from === me
          return (
            <div key={i} className={'msg' + (mine ? ' me' : '')}>
              {!mine && <Avatar id={m.from} size={28} />}
              <div><div className="bubble">{!mine && group && <div className="who">{person(m.from).name}</div>}{m.txt}</div></div>
              <time>{m.t}</time>
            </div>
          )
        })}
        {isTyping && <div className="msg"><Avatar id={typing.who} size={28} /><div className="bubble typing"><span /><span /><span /></div></div>}
      </div>
      {!msgs.some(m => m.from === me) && (
        <div className="quick">{(group ? QUICK_GROUP : QUICK_DM).map(q => <button key={q} onClick={() => send(q)}>{q}</button>)}</div>
      )}
      <div className="composer">
        <input placeholder="Write a message…" value={text} onChange={e => setText(e.target.value)} onKeyDown={e => e.key === 'Enter' && send(text)} />
        <button onClick={() => send(text)} aria-label="Send"><Icon name="send" /></button>
      </div>
    </div>
  )
}
