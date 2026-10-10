import { useApp } from '../store.jsx'
import Icon from './Icon.jsx'

export const NAV_SCREENS = ['discover', 'chat', 'create', 'connect', 'profile']

export default function NavBar() {
  const { view, tab } = useApp()
  const Item = ({ name, icon, label }) => (
    <button className={view.name === name ? 'on' : ''} onClick={() => tab(name)}><Icon name={icon} />{label}</button>
  )
  return (
    <div className="nav">
      <Item name="discover" icon="compass" label="Discover" />
      <Item name="chat" icon="chat" label="Chat" />
      <button onClick={() => tab('create')} aria-label="Host an event"><div className="fab"><Icon name="plus" /></div></button>
      <Item name="connect" icon="users" label="Connect" />
      <Item name="profile" icon="user" label="Profile" />
    </div>
  )
}
