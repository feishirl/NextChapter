# NextChapter

A community app where stay-at-home moms and working moms connect, learn new skills, and grow together. This repo holds our hackathon prototype.

## Run it

It's a single file with no build step. Open `index.html` in Chrome, or serve the folder:

```bash
python -m http.server 5173
```

Then visit http://localhost:5173.

## What's in the prototype

1. **Log-in:** email/Google sign-in, or one-tap demo personas (Yuri and Pauline)
2. **Discover:** search, category chips, filters (format, location, skill level, kid-friendly)
3. **Event details + sign-up form**
4. **Create event:** the coral + button (skill level, format, date, capacity)
5. **Chat:** communities (career, location, children's age, women's age, hobby), custom groups, 1:1 DMs
6. **Profile:** photo, bio, career, kids, hobbies, progress tracker (XP, levels, weekly goals, badges)
7. **Connect:** suggested moms with match reasons, requests, "My circle"

All data is in memory. Refresh the page or click "Reset demo data" to start over.

## Editing guide

Everything lives in `index.html`:

- **Styles:** the `<style>` block. The colors are CSS variables at the top (`--plum`, `--coral`, ...).
- **Demo data:** the `seed()` function (people, events, communities, starter chat messages).
- **Screens:** one function per page (`login`, `discover`, `eventDetail`, `signup`, `create`, `chat`, `thread`, `profile`, `editProfile`, `connect`, `viewPerson`).
- **Badges and XP:** `BADGES`, `LEVELS` and `award()`.

## Demo path

1. Sign in as **Yuri**. Search "resume", open Pauline's workshop and sign up (a badge unlocks).
2. Connect with Pauline, then send her a DM.
3. Join a community and create a custom group.
4. Check Profile progress and badges.
5. Sign out, sign in as **Pauline** and host an event.
