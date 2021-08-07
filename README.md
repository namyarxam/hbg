# HBG Website

[Visit Site!](http://hbg-mc.netlify.app/)

## Features!

- All pages are fully responsive and have certain features scaled appropriatley to be browsable on mobile.

### Home Page

- Home page tracks live twitch channels via the twitch helix API (https://dev.twitch.tv/docs/api/reference)
  - Live channels will have a red border and a red live icon
  - Live channels will also be sorted to the front of the group of streams
- All socials of members linked
- Click on member picture to go to profile page!
- Currently on a 30-second pseudo refresh that pulls the latest API data so live data is up to date

### Profile Page

- Current in-game Minecraft Skin pulled live from https://crafatar.com/ API
- Twitch embed w/ optional chat open/close button
- List of speedruns - currently only supporting 1.16 Icarus, RSG, SSG, FSG
  - Data pulled from https://github.com/speedruncomorg/api
