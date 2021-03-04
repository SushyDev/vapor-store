# Vapor Store 2

```diff
- WARNING: Vapor Store 2 is made to simplify downloading and installing games in a preinstalled format from the internet via a repository/source
- I'm not responsible for the content of the sources our users may use
- I am also not responsible for any legal troubles or computer issues you may face
```

## Table of Contents  <!-- no toc -->
- [Vapor Store 2](#vapor-store-2)
  - [Info](#info)
    - [Download](#download)
    - [Requirements](#requirements)
    - [How to set up](#how-to-set-up)
    - [How to build](#how-to-build-it-yourself)
    - [Roadmap](#roadmap)
    - [Ideas](#ideas)
    - [Issues](#issues)
  - [Support my work](#support-my-work)

## Info

### Download

- [Releases Page](https://github.com/SushyDev/vapor-store/releases)
- [Vapor Store](https://get-vapor.vercel.app/downloads.html)

### Requirements

- [Vapor Store](https://get-vapor.vercel.app/downloads.html)
- [A Repo file](https://discord.gg/ZjDTpmf)

### How to set up

1. Download & Install Vapor Store
2. Download a repo
3. Go to your Vapor Store Settings
4. Select the repo file

### How to build

Building Vapor Store is very simple because its a Electron app, you simply need to download the code from git and run the build command

### Roadmap

#### Done
- [x] Donate Button :D
- [x] Search function for games
- [x] Move to a built in Downloader/Installer
- [x] Download multiple games at the same time
- [x] Own Logo
- [x] Stop / Pause / Resume Downloads
- [x] Launching and deleting games from the app
- [x] Make the Downloads snackbar a universally usable notification system
- [x] InApp Updater
- [x] Have a popup asking to extract or not after download
- [x] Make vapor store single instance
- [x] Create desktop shortcuts
- [x] Move popups to MDC dialogs
- [x] Add scroll buttons for the games screenshots
- [x] Make a easier dialog component just for alerts
- [x] In installed games option have a button to open the games folder
- [x] For executable section have option to run as administrator
- [x] Allow the progress bar to be dynamically added and removed
- [x] Show Download Size
- [x] Game metadata for installed games list
- [x] Show extraction progress
- [x] Make extraction complete popup display even if extract snackbar is hidden
- [x] Clean out the downloader code
- [x] Default play exe for games in folder in installed list
- [x] Setting to auto extract after download
- [x] Search in installed games list
- [x] Import existing games
- [x] Make a desktop notification when the download is completed
- [x] Downloader tab
- [x] Implement better updater
- [x] Clean out the snackbar notification service code
#### Important
- [ ] **Display changelog button on updater notification**
- [ ] **Have option between folder or standalone program in installed list**
- [ ] **Have a button in settings to clear zips in folder**
- [ ] **Custom generator script, custom fetch download script**
- [ ] **Generator / Fetch scripts selector**
#### Other
- [ ] Game sorting by category
- [ ] Game updates
- [ ] Multiple store pages on large searches
- [ ] Implement the Backup & Sync feature
- [ ] Make it so the downloader always over writes zips
- [ ] If installed game folder can't be found have a fallback where the user manually selects the folder
- [ ] When adding your own game have a option to select the metadata
- [ ] Download by link with metadata
- [ ] Move localStorage to electron-store (Possibly? / Maybe make my own minimal version)
- [ ] Add warning when closing the app whilst downloading
- [ ] Minimize to tray on close when downloading

### Goals for alpha
- [x] Update variables
- [ ] Move components to modules
- [ ] Fix FS related code
- [ ] Clean out try/catch
- [ ] Improve stability / code conflicts
- [ ] Make code more readable & minimal  
- [ ] Document the code more
- [ ] a Vapor Store api?
- [ ] Move all popups to MDC Dialogs

## Modules moved

- [x] Init
- [x] Updates
- [x] Game downloads
- [x] Navigation
- [x] IU/Notifications
- [x] Pages
- [x] Settings
- [x] Downloader items
- [x] Installed games
- [ ] Launching games
- [ ] Listing exe's
- [ ] Removing/Deleting installed game
- [ ] Create shortcuts
- [ ] Open containing folder
- [ ] Add custom game

### Issues 

Please report

If you're having any other issues / bugs join our [Discord](https://discord.gg/ZjDTpmf) to report a bug and get support or open an issue on this repository.

## Support my work

 - [Donate](https://ko-fi.com/sushy)
