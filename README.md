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
- [ ] settings
  - [x] show status (lights)
  - [x] show days left
  - [x] change name
  - [x] change description
  - [x] open
  - [x] close
  - [ ] get ip
- [ ] world manipulation
  - [ ] switch slot
  - [ ] download world
  - [ ] reset world
  - [ ] swap to minigame
- [ ] templates (minigames, experience, adventure, etc)
  - [ ] show templates
  - [ ] apply template
  - [ ] search through templates
- [x] list all realms
- [ ] show and accept/deny invitations

## Collaboration

Please, feel free to make a pull request and improve my code. It's a fun hobby project that I honestly didn't put too much effort into, so neither the visuals nor the code itself are super good.
