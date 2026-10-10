import { useApp } from '../store.jsx'
import Icon from '../components/Icon.jsx'
import Avatar from '../components/Avatar.jsx'

const CATS = ['All', 'Career', 'Location', "Kids' age", 'My age', 'Hobby']
const CAT_LABEL = { Career: 'By career', Location: 'By location', "Kids' age": "By children's age", 'My age': 'By your age', Hobby: 'By hobby' }

function Communities() {
  const { S, ui, setUi, isMember, joinGroup, openThread } = useApp()
  const shown = CATS.slice(1).filter(c => ui.grpCat === 'All' || ui.grpCat === c)
  return <>
    <div className="chips" style={{ margin: '14px 0 6px' }}>
      {CATS.map(c => <button key={c} className={'chip' + (ui.grpCat === c ? ' on' : '')} onClick={() => setUi({ grpCat: c })}>{c}</button>)}
    </div>
    {shown.map(c => <div key={c}>
      <div className="cat-label">{CAT_LABEL[c]}</div>
      {S.groups.filter(g => g.cat === c).map(g => (
        <div key={g.id} className="list-item">
          <div className="grp-av" style={{ background: g.bg }}>{g.emoji}</div>
          <div className="grow"><b>{g.name}</b><div className="sub">{g.members.toLocaleString()} moms</div></div>
          {isMember(g.id)
            ? <button className="btn sm done" onClick={() => openThread(g.id)}>Open</button>
            : <button className="btn sm primary" onClick={() => joinGroup(g.id)}>Join</button>}
        </div>
      ))}
    </div>)}
  </>
}

function MyGroups() {
  const { me, allGroups, isMember, lastMsg, firstName, openThread, openSheet, setUi } = useApp()
  const mine = allGroups().filter(g => isMember(g.id))
  return <>
    <div style={{ padding: '14px 20px 4px' }}>
      <button className="btn ghost" style={{ height: 46 }} onClick={() => openSheet('newGroup')}><Icon name="plus" /> Create a custom group</button>
    </div>
    {mine.length ? mine.map(g => {
      const m = lastMsg(g.id)
      return (
        <button key={g.id} className="list-item" onClick={() => openThread(g.id)}>
          <div className="grp-av" style={{ background: g.bg }}>{g.emoji}</div>
          <div className="grow"><b>{g.name}</b><div className="sub">{m ? `${m.from === me ? 'You' : firstName(m.from)}: ${m.txt}` : 'Say hello 👋'}</div></div>
          <span className="faint" style={{ fontSize: 11 }}>{m?.t}</span>
        </button>
      )
    }) : <div className="empty"><div>🏡</div>You haven't joined any communities yet.</div>}
    <div style={{ padding: '6px 20px' }}>
      <button className="btn sm ghost" style={{ width: '100%' }} onClick={() => setUi({ chatTab: 'discover' })}>Browse all communities →</button>
    </div>
  </>
}

function Direct() {
  const { S, me, connected, dmKey, lastMsg, person, openDM, tab } = useApp()
  const friends = connected()
  const withThreads = friends.filter(f => S.threads[dmKey(f)])
  const without = friends.filter(f => !S.threads[dmKey(f)])
  return <>
    {withThreads.map(f => {
      const m = lastMsg(dmKey(f))
      return (
        <button key={f} className="list-item" onClick={() => openDM(f)}>
          <Avatar id={f} size={48} />
          <div className="grow"><b>{person(f).name}</b><div className="sub">{m.from === me ? 'You: ' : ''}{m.txt}</div></div>
          <span className="faint" style={{ fontSize: 11 }}>{m.t}</span>
        </button>
      )
    })}
    <div className="cat-label">Start a conversation</div>
    {without.length ? without.map(f => (
      <button key={f} className="list-item" onClick={() => openDM(f)}>
        <Avatar id={f} size={48} />
        <div className="grow"><b>{person(f).name}</b><div className="sub">{person(f).career}</div></div>
        <Icon name="chat" />
      </button>
    )) : (
      <div className="faint" style={{ padding: '8px 20px', fontSize: 13 }}>Connect with more moms to message them 1:1.{' '}
        <b style={{ color: 'var(--plum)', cursor: 'pointer' }} onClick={() => tab('connect')}>Find moms →</b></div>
    )}
  </>
}

export default function Chat() {
  const { ui, setUi } = useApp()
  const T = ({ id, label }) => <button className={ui.chatTab === id ? 'on' : ''} onClick={() => setUi({ chatTab: id })}>{label}</button>
  return (
    <div className="screen">
      <div className="topbar"><h2>Chat</h2></div>
      <div className="seg"><T id="groups" label="My groups" /><T id="discover" label="Communities" /><T id="dm" label="Direct" /></div>
      {ui.chatTab === 'discover' ? <Communities /> : ui.chatTab === 'groups' ? <MyGroups /> : <Direct />}
    </div>
  )
}
