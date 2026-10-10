# NextChapter

A community app where working moms connect, learn new skills, and grow together. This repo holds our hackathon prototype.

**Tech stack:** React 18 + Vite, Three.js (via React Three Fiber) for the 3D community network, plain CSS.

## Run it

You need [Node.js](https://nodejs.org) 18 or newer.

```bash
npm install
npm run dev
```

Then open http://localhost:5173.

- **Laptop:** the app shows inside a phone mockup that scales to fit your window, with the demo script beside it.
- **Real phone:** open the same URL (or the deployed link) and the app fills the whole screen.

To make a production build, run `npm run build` (the output goes to `dist/`). The project deploys to Vercel as-is.

## Project structure

```
src/
  data.js            demo data: people, events, communities, starter chats, badges
  store.jsx          shared app state and actions (navigation, sign-up, chat, XP and badges)
  App.jsx            picks which screen to show
  styles.css         all styles (colors are CSS variables at the top)
  components/        reusable pieces: Avatar, Icon, NavBar, PhoneFrame, Constellation (3D), ...
  screens/           one file per page
    Login.jsx        1. Log-in (with the 3D hero)
    Discover.jsx     2. Events and programs: search and filters
    EventDetail.jsx  3. Event details
    Signup.jsx       3. Sign-up form
    Success.jsx      3. "You're in!" confirmation
    CreateEvent.jsx  4. Host an event (skill level, format, ...)
    Chat.jsx         5. Communities, my groups, direct messages
    Thread.jsx       5. A single conversation
    Profile.jsx      6. Profile, progress tracker, badges
    EditProfile.jsx  6. Edit profile
    Connect.jsx      7. Suggested moms, requests, my circle
    PersonView.jsx   7. Another mom's profile
legacy/prototype.html   the original single-file version
```

**Working as a team:** each page is its own file, so split the work by page to avoid merge conflicts. Run `git pull` before you start and push as soon as you're done.

All data is in memory. Refresh the page or click "Reset demo data" to start over.

## Demo path

1. Sign in as **Shirley**. Search "leadership", open Aesha's workshop and sign up (a badge unlocks).
2. Connect with Aesha, then send her a DM.
3. Join a community and create a custom group.
4. Check Profile progress and badges.
5. Sign out, sign in as **Aesha** and host an event.
