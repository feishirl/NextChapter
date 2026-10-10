import { createContext, useContext, useReducer, useRef, useState } from 'react'
import { seed, BADGES, PAST_EVENTS, lvl, levelName } from './data.js'

// One in-memory store for the whole demo. Screens read from it via useApp()
// and change it through the actions below; every change re-renders the app.

const AppContext = createContext(null)
export const useApp = () => useContext(AppContext)

const initialUi = () => ({
  q: '', cat: 'All', showFilters: false, format: 'All', city: 'All', level: 'All', kidOnly: false,
  chatTab: 'groups', grpCat: 'All', connTab: 'suggested', connQ: '', connEvent: 'all'
})
const fresh = () => ({ S: seed(), me: null, view: { name: 'login' }, stack: [], viewKey: 0, ui: initialUi(), typing: null, sheet: null })

const GROUP_REPLIES = ["Welcome! So happy you're here 💜", "Hi! You'll love this group.", 'Welcome!! Check the pinned post for upcoming meetups 😊', "Yes! A few of us are going — let's sit together."]
const DM_REPLIES = {
  aesha: ["Hi Shirley! So glad you reached out 😊 Bring your questions to Tuesday's workshop — we'll dig into them together.", "Absolutely. Happy to do a 20-min call next week — I've been exactly where you are."],
  shirley: ['Thank you so much, Aesha! That means a lot 💜', "I'd love that — I'll bring my questions!"],
  jen: ['Yes!! Same bench by the zoo? ☕'], nia: ['Happy to share my data analytics roadmap!'], dana: ['Haha twin life — always up for coffee!'],
  maria: ['Count me in!'], lauren: ['Love this group 💜'], priya: ["You've got this — DM me anytime!"]
}
const GROUP_MEMBERS = ['maria', 'dana', 'nia', 'jen', 'lauren', 'priya']

export function AppProvider({ children }) {
  const ref = useRef(null)
  if (!ref.current) ref.current = fresh()
  const st = ref.current
  const [, force] = useReducer(x => x + 1, 0)
  const [toastState, setToastState] = useState(null)
  const toastTimer = useRef()

  const mutate = fn => { fn(st); force() }

  /* ---- lookups ---- */
  const person = id => st.S.people[id]
  const prog = (who = st.me) => st.S.progress[who]
  const firstName = id => person(id).name.split(' ')[0]
  const allGroups = () => [...st.S.groups, ...st.S.customGroups]
  const groupById = id => allGroups().find(g => g.id === id)
  const isMember = gid => prog().joined.includes(gid) || st.S.customGroups.some(g => g.id === gid && g.members.includes(st.me))
  const dmKey = other => 'dm:' + [st.me, other].sort().join('|')
  const lastMsg = key => { const t = st.S.threads[key] || []; return t[t.length - 1] }
  const connected = () => Object.entries(prog().conns).filter(([, s]) => s === 'connected').map(([id]) => id)

  // Why two moms might click: events they both went to come first, then location, hobbies and goals.
  function matchInfo(id) {
    const a = person(st.me), b = person(id), reasons = []
    let score = 55
    const sharedEvents = PAST_EVENTS.filter(e => (a.attended || []).includes(e.id) && (b.attended || []).includes(e.id))
    sharedEvents.forEach(e => { reasons.push(['gold', `${e.emoji} You both went to ${e.title}`]); score += 12 })
    if (a.city === b.city) { reasons.push(['sage', '📍 Both in ' + b.city]); score += 10 }
    a.hobbies.filter(h => b.hobbies.includes(h)).slice(0, 2).forEach(h => { reasons.push(['plum', '💜 Loves ' + h.toLowerCase()]); score += 6 })
    if (st.me === 'shirley' && /software|engineer|data|analyst|CTO|owner/i.test(b.career)) { reasons.push(['coral', '🎯 Can help you grow']); score += 8 }
    if (st.me === 'aesha' && b.age < 40) { reasons.push(['coral', '🌱 Could use a mentor']); score += 8 }
    return { score: Math.min(score, 98), reasons, sharedEvents }
  }

  /* ---- feedback ---- */
  function toast(e, title, sub = '') {
    clearTimeout(toastTimer.current)
    setToastState({ e, title, sub, id: Date.now() })
    toastTimer.current = setTimeout(() => setToastState(null), 2600)
  }
  function award(xp, badge) {
    const p = prog(), before = lvl(p.xp)
    p.xp += xp
    let unlocked = null
    if (badge && !p.badges.includes(badge)) { p.badges.push(badge); unlocked = BADGES.find(b => b.id === badge) }
    force()
    setTimeout(() => unlocked
      ? toast(unlocked.e, `Badge unlocked: ${unlocked.n}`, `+${xp} XP`)
      : toast('⭐', `+${xp} XP`, 'Nice! Keep the momentum going.'), 350)
    const after = lvl(p.xp)
    if (after > before) setTimeout(() => toast('🎉', `Level up! You're now Level ${after}`, levelName(after)), 2700)
  }

  /* ---- navigation ---- */
  const go = (name, params = {}, push = true) => mutate(s => { if (push) s.stack.push(s.view); s.view = { name, ...params }; s.viewKey++ })
  const back = () => mutate(s => { s.view = s.stack.pop() || { name: 'discover' }; s.viewKey++ })
  const tab = name => mutate(s => { s.stack = []; s.view = { name }; s.viewKey++ })
  const setUi = patch => mutate(s => Object.assign(s.ui, patch))
  const openSheet = name => mutate(s => { s.sheet = name })
  const closeSheet = () => mutate(s => { s.sheet = null })

  /* ---- auth ---- */
  function signIn(id) {
    mutate(s => { s.me = id; s.stack = []; s.view = { name: 'discover' }; s.viewKey++ })
    setTimeout(() => toast('👋', `Welcome back, ${firstName(id)}!`, id === 'shirley' ? '🔥 3-day streak — keep it going' : 'You have 1 new connection request'), 300)
  }
  const signOut = () => mutate(s => { s.me = null; s.stack = []; s.view = { name: 'login' }; s.viewKey++ })
  const resetDemo = () => { ref.current = fresh(); setToastState(null); force() }

  /* ---- events ---- */
  function registerEvent(eventId) {
    const e = st.S.events.find(x => x.id === eventId)
    prog().regs.push(e.id); e.going++
    st.view = st.stack.pop() // drop the sign-up form so "back" from success returns to the event
    go('success', { id: e.id })
    award(50, 'first_event')
  }
  function publishEvent(data) {
    const [hh, mm] = data.time.split(':').map(Number)
    const time = `${(hh % 12) || 12}:${String(mm).padStart(2, '0')} ${hh < 12 ? 'AM' : 'PM'}`
    const bgs = ['#fde9e3', '#e3eef8', '#e3f1ea', '#fbf1dc', '#f3e8f3', '#ece6f7']
    const e = {
      id: 'e' + (st.S.nextId++), title: data.title.trim(), host: st.me, cat: data.cat, level: data.level, format: data.format,
      city: data.format === 'Online' ? 'Online' : data.city, date: data.date, time, dur: '60 min', cap: Number(data.cap) || 20,
      going: 1, kid: data.kid, emoji: data.emoji, bg: bgs[st.S.nextId % bgs.length], desc: data.desc.trim(),
      learn: ['Hosted by a NextChapter member', 'Q&A and networking']
    }
    st.S.events.push(e)
    st.stack = [{ name: 'discover' }]
    st.view = { name: 'event', id: e.id }
    st.viewKey++
    award(100, 'host')
  }

  /* ---- communities & chat ---- */
  function joinGroup(id) { prog().joined.push(id); groupById(id).members++; award(20, 'community') }
  function createGroup({ name, emoji, desc, invite }) {
    const id = 'c' + (st.S.nextId++)
    st.S.customGroups.push({ id, cat: 'Custom', name: name.trim(), emoji, bg: '#f3e8f3', members: [st.me, ...invite] })
    st.S.threads[id] = [{ from: st.me, t: 'now', txt: `Welcome to ${name.trim()}! ${desc || ''}`.trim() }]
    st.sheet = null
    st.ui.chatTab = 'groups'
    award(40, 'founder')
  }
  function sendMsg(key, text, { group, other }) {
    const txt = text.trim()
    if (!txt) return
    const who = st.me
    if (!st.S.threads[key]) st.S.threads[key] = []
    st.S.threads[key].push({ from: who, t: 'now', txt })
    if (!prog().badges.includes('ice')) award(20, 'ice'); else force()

    const responder = group ? GROUP_MEMBERS[Math.floor(Math.random() * GROUP_MEMBERS.length)] : other
    const pool = group ? GROUP_REPLIES : (DM_REPLIES[responder] || ['💜'])
    const sent = st.S.threads[key].filter(m => m.from === who).length
    setTimeout(() => mutate(s => { s.typing = { key, who: responder } }), 700)
    setTimeout(() => mutate(s => {
      s.typing = null
      s.S.threads[key].push({ from: responder, t: 'now', txt: pool[(sent - 1) % pool.length] })
    }), 2200)
  }

  /* ---- connections ---- */
  function connectTo(id) {
    if (prog().conns[id]) return
    const who = st.me
    prog().conns[id] = 'pending'
    force()
    toast('📨', `Request sent to ${firstName(id)}`)
    setTimeout(() => {
      st.S.progress[who].conns[id] = 'connected'
      if (st.S.progress[id]) st.S.progress[id].conns[who] = 'connected'
      force()
      if (st.me !== who) return
      toast('🤝', `${firstName(id)} accepted your request!`, 'You can now message each other')
      setTimeout(() => award(30, 'circle'), 2700)
    }, 2500)
  }
  function accept(id) {
    prog().conns[id] = 'connected'
    if (st.S.progress[id]) st.S.progress[id].conns[st.me] = 'connected'
    award(30, 'circle')
  }
  const decline = id => mutate(() => { delete prog().conns[id] })

  /* ---- profile ---- */
  const setPhoto = dataUrl => { mutate(() => { person(st.me).photo = dataUrl }); toast('📸', 'Profile photo updated') }
  const saveProfile = patch => { Object.assign(person(st.me), patch); back(); toast('✅', 'Profile saved') }

  const value = {
    ...st, toastState,
    person, prog, firstName, allGroups, groupById, isMember, dmKey, lastMsg, connected, matchInfo,
    toast, award, go, back, tab, setUi, openSheet, closeSheet, signIn, signOut, resetDemo,
    registerEvent, publishEvent, joinGroup, createGroup, sendMsg, connectTo, accept, decline, setPhoto, saveProfile,
    openThread: id => go('thread', { key: id, group: true }),
    openDM: other => go('thread', { key: dmKey(other), other })
  }
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
