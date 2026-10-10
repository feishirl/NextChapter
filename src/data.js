// Demo data for the prototype. Edit people, events, communities and starter chats here.

export const LEVELS = ['Newcomer','Explorer','Connector','Contributor','Mentor','Trailblazer','Luminary']
export const XP_PER_LEVEL = 250
export const lvl = xp => Math.floor(xp / XP_PER_LEVEL) + 1
export const levelName = l => LEVELS[Math.min(l - 1, LEVELS.length - 1)]

export const BADGES = [
  {id:'welcome', e:'🌱', n:'First Chapter'},
  {id:'first_event', e:'🎟️', n:'First RSVP'},
  {id:'ice', e:'💬', n:'Ice Breaker'},
  {id:'circle', e:'🤝', n:'Circle Builder'},
  {id:'community', e:'🏡', n:'Joined a Community'},
  {id:'host', e:'🎤', n:'Event Host'},
  {id:'founder', e:'✨', n:'Group Founder'},
  {id:'streak3', e:'🔥', n:'3-Day Streak'},
  {id:'mentor', e:'🌟', n:'Mentor'}
]

export const fmtDate = d => new Date(d + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
export const shortDate = d => new Date(d + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase()

export const SITUATIONS = ['Stay-at-home mom', 'Working mom', 'Returning to work', 'Student mom']
export const EVENT_CATEGORIES = ['Career', 'Upskill', 'Wellness', 'Hobby', 'Social']
export const CITIES = ['Chicago', 'Evanston', 'Oak Park', 'Naperville']

export function seed(){
  return {
    people: {
      yuri:   {id:'yuri', name:'Yuri K.', age:35, city:'Chicago', hood:'Lakeview', color:'#e8735a', photo:null,
               situation:'Stay-at-home mom', career:'Former marketing coordinator · learning data analytics',
               kids:'1 daughter (3 yrs)', kidAges:[3], hobbies:['Yoga','Baking','Podcasts'],
               interests:['Upskill','Career'],
               bio:"Stay-at-home mom to a curious 3-year-old. Ready to start my next chapter — learning data analytics and looking for moms who've made the leap back to work."},
      pauline:{id:'pauline', name:'Pauline M.', age:46, city:'Oak Park', hood:'Oak Park', color:'#7a3b7d', photo:null,
               situation:'Working mom', career:'HR Director · 18 yrs in talent & recruiting',
               kids:'2 kids (11 & 15)', kidAges:[11,15], hobbies:['Running','Book club','Gardening'],
               interests:['Mentoring','Career'],
               bio:"Working mom of two. I've hired hundreds of people and returned to work twice myself — happy to help moms polish resumes and negotiate with confidence."},
      aisha:  {id:'aisha', name:'Aisha R.', age:33, city:'Chicago', career:'Data analyst at a health-tech startup', kids:'2 kids (2 & 5)', kidAges:[2,5], hobbies:['Yoga','Podcasts'], color:'#4f8a6e', situation:'Working mom'},
      maria:  {id:'maria', name:'Maria G.', age:38, city:'Evanston', career:'Pediatric nurse, part-time', kids:'1 son (4 yrs)', kidAges:[4], hobbies:['Baking','Gardening'], color:'#d9a23a', situation:'Working mom'},
      jen:    {id:'jen', name:'Jen L.', age:34, city:'Chicago', career:'Freelance graphic designer', kids:'1 son (2 yrs)', kidAges:[2], hobbies:['Crafts','Yoga'], color:'#4a6fa5', situation:'Working mom'},
      priya:  {id:'priya', name:'Priya S.', age:41, city:'Naperville', career:'Senior software engineer', kids:'2 kids (1 & 7)', kidAges:[1,7], hobbies:['Running','Book club'], color:'#b0577a', situation:'Working mom'},
      dana:   {id:'dana', name:'Dana W.', age:37, city:'Oak Park', career:'Stay-at-home mom · ex-accountant', kids:'Twins (3 yrs)', kidAges:[3,3], hobbies:['Baking','Podcasts','Running'], color:'#6b5ca5', situation:'Stay-at-home mom'},
      lauren: {id:'lauren', name:'Lauren T.', age:49, city:'Chicago', career:'High school teacher', kids:'1 daughter (16)', kidAges:[16], hobbies:['Book club','Gardening'], color:'#3f8f8f', situation:'Working mom'}
    },
    progress: {
      yuri:   {xp:320, badges:['welcome','streak3'], regs:[], joined:['g_toddler'], conns:{jen:'connected', aisha:'incoming'}},
      pauline:{xp:1240, badges:['welcome','streak3','first_event','ice','circle','community','host','mentor'], regs:['e7'], joined:['g_40plus','g_book','g_west'], conns:{dana:'connected', lauren:'connected', maria:'connected', priya:'incoming'}}
    },
    events: [
      {id:'e1', title:'Resume Refresh: Returning After a Career Break', host:'pauline', cat:'Career', level:'Beginner', format:'Online', city:'Online', date:'2026-10-13', time:'7:30 PM', dur:'90 min', cap:25, going:18, kid:true, emoji:'📄', bg:'#fde9e3',
       desc:"Turn your career gap into a strength. We'll rewrite your summary, frame caregiving years with confidence, and do live resume reviews in small breakout rooms.",
       learn:['How to explain a career gap in one sentence','Translating mom skills into resume bullets','Live 1:1 feedback from a hiring manager']},
      {id:'e2', title:'Intro to Data Analytics with Excel', host:'aisha', cat:'Upskill', level:'Beginner', format:'Online', city:'Online', date:'2026-10-14', time:'1:00 PM', dur:'60 min', cap:40, going:31, kid:true, emoji:'📊', bg:'#e3eef8',
       desc:'A nap-time friendly crash course on pivot tables, charts, and cleaning data — the first step toward an analytics career.',
       learn:['Pivot tables in 10 minutes','Building your first dashboard','Free resources to keep going']},
      {id:'e3', title:'Stroller Walk & Talk — Lincoln Park', host:'jen', cat:'Wellness', level:'All levels', format:'In person', city:'Chicago', date:'2026-10-15', time:'10:00 AM', dur:'60 min', cap:15, going:9, kid:true, emoji:'🌳', bg:'#e3f1ea',
       desc:'Bring the little ones and a coffee. An easy 3-mile loop around the zoo with moms from the North Side.',
       learn:['Fresh air and new friends','Meet at the Cafe Brauer entrance']},
      {id:'e4', title:'Freelancing 101: Pricing Your Skills', host:'jen', cat:'Career', level:'Intermediate', format:'Online', city:'Online', date:'2026-10-17', time:'8:00 PM', dur:'75 min', cap:30, going:22, kid:false, emoji:'💼', bg:'#fbf1dc',
       desc:'How to set rates, find first clients, and build flexible work around school pickup.',
       learn:['Hourly vs. project pricing','Where moms find their first clients','Contracts made simple']},
      {id:'e5', title:'Watercolor Night (Moms Only)', host:'maria', cat:'Hobby', level:'Beginner', format:'In person', city:'Evanston', date:'2026-10-18', time:'6:30 PM', dur:'2 hrs', cap:12, going:10, kid:false, emoji:'🎨', bg:'#f3e8f3',
       desc:'A relaxing evening of painting, snacks, and zero laundry. All supplies provided.',
       learn:['Basic watercolor techniques','Take home your own piece']},
      {id:'e6', title:'LinkedIn Profile Glow-Up', host:'priya', cat:'Upskill', level:'Beginner', format:'Online', city:'Online', date:'2026-10-20', time:'12:00 PM', dur:'45 min', cap:50, going:27, kid:true, emoji:'✨', bg:'#e8eefb',
       desc:'Headline, about section, and skills — get recruiters finding you again.',
       learn:['Headline formulas that work','Using the "Career break" feature','Getting recommendations']},
      {id:'e7', title:'Leadership Circle for Returning Managers', host:'pauline', cat:'Career', level:'Advanced', format:'In person', city:'Oak Park', date:'2026-10-22', time:'7:00 PM', dur:'90 min', cap:10, going:7, kid:false, emoji:'🧭', bg:'#ece6f7',
       desc:'A small peer circle for moms stepping back into management roles. Bring a real challenge; leave with a plan.',
       learn:['Negotiating flexible schedules','Leading teams after time away','Peer coaching']},
      {id:'e8', title:'Toddler Playdate + Coffee', host:'dana', cat:'Social', level:'All levels', format:'In person', city:'Oak Park', date:'2026-10-24', time:'9:30 AM', dur:'2 hrs', cap:20, going:12, kid:true, emoji:'🧸', bg:'#fdeee3',
       desc:'Indoor play space for kids 1–4, coffee and pastries for the grown-ups.',
       learn:['Kids 1–4 welcome','Snacks provided']}
    ],
    groups: [
      {id:'g_tech', cat:'Career', name:'Moms in Tech & Data', emoji:'💻', members:1240, bg:'#e3eef8'},
      {id:'g_health', cat:'Career', name:'Healthcare Moms', emoji:'🩺', members:860, bg:'#e3f1ea'},
      {id:'g_return', cat:'Career', name:'Returning to Work', emoji:'🚀', members:2105, bg:'#fde9e3'},
      {id:'g_north', cat:'Location', name:'Chicago North Side Moms', emoji:'📍', members:930, bg:'#f3e8f3'},
      {id:'g_west', cat:'Location', name:'Western Suburbs Moms', emoji:'🏘️', members:715, bg:'#fbf1dc'},
      {id:'g_toddler', cat:"Kids' age", name:'Toddler Years (1–3)', emoji:'🧸', members:1580, bg:'#fdeee3'},
      {id:'g_school', cat:"Kids' age", name:'School-Age Kids (6–12)', emoji:'🎒', members:1320, bg:'#e3f1ea'},
      {id:'g_teens', cat:"Kids' age", name:'Parenting Teens', emoji:'🎧', members:640, bg:'#e8eefb'},
      {id:'g_30s', cat:'My age', name:'Moms in Our 30s', emoji:'🌸', members:1890, bg:'#f3e8f3'},
      {id:'g_40plus', cat:'My age', name:'40+ and Thriving', emoji:'🌻', members:1010, bg:'#fbf1dc'},
      {id:'g_book', cat:'Hobby', name:'Mom Book Club', emoji:'📚', members:540, bg:'#ece6f7'},
      {id:'g_run', cat:'Hobby', name:'Running Moms', emoji:'👟', members:470, bg:'#e3f1ea'},
      {id:'g_bake', cat:'Hobby', name:'Weekend Bakers', emoji:'🧁', members:390, bg:'#fde9e3'}
    ],
    threads: {
      'g_toddler':[{from:'dana',t:'Yesterday',txt:'Anyone have tips for a toddler who suddenly hates naps? 😩'},{from:'jen',t:'Yesterday',txt:'We moved nap 30 min later and it helped a ton!'},{from:'maria',t:'9:12 AM',txt:'Also: quiet time with books counts as a win in my house 😂'}],
      'g_return':[{from:'pauline',t:'Yesterday',txt:"Reminder: my resume workshop is Tuesday — bring a draft, no matter how rough!"},{from:'priya',t:'8:40 AM',txt:'Just got an offer after 4 years home. You all helped me so much 💜'}],
      'g_tech':[{from:'aisha',t:'Yesterday',txt:'Sharing my favorite free SQL course in the files tab 👀'}],
      'g_40plus':[{from:'lauren',t:'Yesterday',txt:'Who else is juggling teens AND aging parents this fall?'},{from:'pauline',t:'Yesterday',txt:'Raising my hand. Coffee this week?'}],
      'g_book':[{from:'lauren',t:'Mon',txt:"October pick: 'Lessons in Chemistry' — meeting on the 28th!"}],
      'g_west':[{from:'dana',t:'Sun',txt:'Pumpkin patch meetup Saturday, who is in? 🎃'}],
      'dm:jen|yuri':[{from:'jen',t:'Wed',txt:'So fun meeting you at the park! Same time next week?'},{from:'yuri',t:'Wed',txt:'Yes! Lily loved it 😊'}],
      'dm:dana|pauline':[{from:'dana',t:'Tue',txt:'Thank you for the interview tips!!'}]
    },
    customGroups: [],
    nextId: 100
  };
}
