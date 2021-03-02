// ! Initialize script
// ? Sets some constants and clears the session storage when the app first starts

// # Electron stuff
const {dialog, BrowserWindow, ipcMain, process, Notification, app} = require('electron').remote;
const {ipcRenderer, remote} = require('electron');
const win = require('electron').remote.getCurrentWindow();

// # For launching apps
const childProcess = require('child_process');
// # File system
const fs = require('fs');
// # Jquery
const $ = require('jquery');
// # Puppeteer for webscraping
const puppeteer = require('puppeteer');
// # Extract for extracting zip files
const extract = require('extract-zip');
// # Path for directory stuff
const path = require('path');
// # rimraf for deleting folders
const rimraf = require('rimraf');
// # Shell for shell commands
const shell = require('electron').shell;
// # For executing files
const exec = require('child_process').exec;
// # For creating desktop shortcuts
const createDesktopShortcut = require('../libraries/create-desktop-shortcuts');
// # If development

const isAlpha = app.getVersion().includes('alpha');
const isDev = isAlpha ? true : require('electron-is-dev');

// ! Import vapor store modules

const vapor = require('../js/modules/vapor-modules');
const management = require('../js/modules/management-modules');
const downloader = require('../js/modules/downloader/modules');

//Clear Sesion Storage
sessionStorage.clear();

if (isDev) isAlpha ? console.log('Hi alpha tester') : console.log('Hi Developer');
vapor.app.Initialize();

let currentDownloadName = [];
let currentDownloadData = [];
let extractNeedsConfirm = [];
let currentExtractions = [];
let fetchingDownload = [];
