# Realms Website / Realms Admin
My attempt at making a website that allows you to modify your Minecraft Realm from outside the game

The plan is to make it run on a website in the future, maybe even a mobile app. But not before it's stable, safe and decently functional.

## See it in action
[➡ click here ⬅](https://plagiatus.github.io/RealmsWebsite/client/)  
WARNING: This is the very WIP version of the Repo and everything might break at any time for any reason. For a more stable, less "nightly" version try [this](https://plagiatus.net/tools/realmadmin/).


## How to run for yourself

### Setup
1. Clone/Download Repo (duh)
1. make sure you have Node.js installed.
1. run `npm i` in the main folder.

### Run
1. run `node ./server/main.js`
1. open `/client/java/index.html` in a browser of your choice (preferrably Firefox or Chrome)  

That's it, now it's running and ready to be used.

## Tasks
- [x] login
  - [x] email+pw
  - [x] token
- [x] logout
- [x] player manipulation
  - [x] invite player
  - [x] remove player
  - [x] op player
  - [x] deop player
  - [x] search through players
- [x] overview
  - [x] Realm status
  - [x] online players
  - [x] selected world + icon
- [x] settings
  - [x] show status (lights)
  - [x] show days left
  - [x] change name
  - [x] change description
  - [x] open
  - [x] close
  - [x] get ip
- [ ] world manipulation
  - [x] switch slot
  - [x] change slot settings
  - [ ] download world
  - [ ] reset world
    - [x] new world
    - [ ] upload world
    - [x] choose template
  - [x] swap to minigame
  - [ ] list, apply and download backups
- [ ] templates (minigames, experience, adventure, etc)
  - [x] show templates
  - [x] apply template
  - [x] search through templates
  - [ ] favorite templates
  - [ ] choose a random template
- [x] list all realms
- [x] show and accept/deny invitations
- [x] cookie notice page
- [ ] performance improvements
  - [x] save some frequently requested stuff via localStorage, to cut down on the requests needed and to decrease the loading time at the opening of the websites.
  - [x] use async requests so the browser doesn't freeze
  - [ ] potentially change the server request structure to direct API calls instead of using the npm module and its overhead
- [ ] Design
  - [x] basic styling and responsiveness
  - [ ] rework the CSS once a cohesive design is found
    - [ ] toggle between light/dark mode
- [ ] Decide how multiple Tabs should behave and implement changes accordingly

### Future Plans
_(things that won't happen anytime soon, but might happen eventually)_

- Add a rating system for maps
- Add some form of stats: 
  - for Page: amount of users, amount of actions
  - for Maps: amount of times a map is selected, etc.
- Turn this from a website into a mobile/standalone app
- Include Bedrock Edition Realms
- Include some non-intrusive ads on the website (it costs money to run the site :frowning: )

## Collaboration

Please, feel free to make a pull request and improve my code. It's a fun hobby project that I honestly didn't put too much effort into, so neither the visuals nor the code itself are super good.
