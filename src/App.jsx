import { useEffect, useState } from 'react'
import { useApp } from './store.jsx'
import PhoneFrame from './components/PhoneFrame.jsx'
import NavBar, { NAV_SCREENS } from './components/NavBar.jsx'
import Toast from './components/Toast.jsx'
import NewGroupSheet from './components/NewGroupSheet.jsx'
import Constellation from './components/Constellation.jsx'
import Login from './screens/Login.jsx'
import Discover from './screens/Discover.jsx'
import EventDetail from './screens/EventDetail.jsx'
import Signup from './screens/Signup.jsx'
import Success from './screens/Success.jsx'
import CreateEvent from './screens/CreateEvent.jsx'
import Chat from './screens/Chat.jsx'
import Thread from './screens/Thread.jsx'
import Profile from './screens/Profile.jsx'
import EditProfile from './screens/EditProfile.jsx'
import Connect from './screens/Connect.jsx'
import PersonView from './screens/PersonView.jsx'

const SCREENS = {
  login: Login, discover: Discover, event: EventDetail, signup: Signup, success: Success, create: CreateEvent,
  chat: Chat, thread: Thread, profile: Profile, editProfile: EditProfile, connect: Connect, person: PersonView
}

function useIsDesktop() {
  const q = '(min-width: 821px)'
  const [match, setMatch] = useState(() => window.matchMedia(q).matches)
  useEffect(() => {
    const m = window.matchMedia(q), on = () => setMatch(m.matches)
    m.addEventListener('change', on)
    return () => m.removeEventListener('change', on)
  }, [])
  return match
}

function SidePanel() {
  const { resetDemo } = useApp()
  return (
    <div className="side">
      <h1>NextChapter</h1>
      <p>A community where stay-at-home moms and working moms connect, learn from each other, and grow together.</p>
      <div className="steps">
        <b>Demo path</b><br />
        1. Sign in as <b>Yuri</b><br />
        2. Search "resume", filter, open event<br />
        3. Sign up → earn a badge<br />
        4. Connect with Pauline &amp; send a DM<br />
        5. Join a community, make a custom group<br />
        6. Check profile progress &amp; badges<br />
        7. Sign out, sign in as <b>Pauline</b> → create an event
      </div>
      <button className="reset" onClick={resetDemo}>Reset demo data</button>
    </div>
  )
}

export default function App() {
  const { view, viewKey, me, sheet } = useApp()
  const desktop = useIsDesktop()
  const Screen = SCREENS[view.name]
  return (
    <>
      {desktop && <div className="bg3d"><Constellation variant="background" /></div>}
      {desktop && <SidePanel />}
      <PhoneFrame>
        <Screen key={viewKey} />
        {me && NAV_SCREENS.includes(view.name) && <NavBar />}
        {sheet === 'newGroup' && <NewGroupSheet />}
        <Toast />
      </PhoneFrame>
    </>
  )
}
