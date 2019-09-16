# RealmsWebsite
My attempt at making a website that allows you to modify your Minecraft Realm from outside the game

The plan is to make it run on a website in the future, maybe even a mobile app. But not before it's stable, safe and decently functional.

## How to run for yourself

### Setup
1. Clone/Download Repo (duh)
1. make sure you have Node.js installed.
1. run `npm i` in both `/server` and `/MojangAPI`.

### Run
1. run `node ./server/main.js`
1. open `/client/index.html` in a browser of your choice (preferrably Firefox or Chrome)  

That's it, now it's running and ready to be used.

## Tasks
- [x] login
  - [x] Email/PW
  - [x] IGN/AuthToken
- [x] player manipulation
  - [x] invite player
  - [x] remove player
  - [x] op player
  - [x] deop player
  - [ ] search through players
- [ ] realm manipulation
  - [ ] show days left
  - [ ] change name
  - [ ] change motd
  - [ ] open
  - [ ] close
  - [ ] get ip
  - [ ] show status (lights)
- [ ] world manipulation
  - [ ] switch slot
  - [ ] download world
  - [ ] reset world
  - [ ] swap to minigame
- [ ] templates (minigames, experience, adventure, etc)
  - [ ] show templates
  - [ ] apply template
  - [ ] search through templates
- [ ] support more than 1 realm

## Collaboration

Please, feel free to make a pull request and improve my code. It's a fun hobby project that I honestly didn't put too much effort into, so neither the visuals nor the code itself is super good.
