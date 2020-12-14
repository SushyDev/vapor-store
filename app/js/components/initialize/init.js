//Initialize script
//Sets some constants and clears the session storage when the app first starts

//For launching apps
const childProcess = require('child_process');
//File system
const fs = require('fs');
//Steam grid
const SGDB = require('steamgriddb');
//Jquery
const $ = require('jquery');
//Puppeteer for webscraping
const puppeteer = require('puppeteer');
//Extract for extracting zip files
const extract = require('extract-zip');
//Electron built in downloader wrapper
const electronDl = require('electron-dl');
//Path for directory stuff
const path = require('path');
//rimraf for deleting folders
const rimraf = require('rimraf');
//Shell for shell commands
const shell = require('electron').shell;

//Electron stuff
const {ipcRenderer, remote} = require('electron');
const app = require('electron').remote.app;
const win = require('electron').remote.getCurrentWindow();
const {dialog, BrowserWindow, process} = require('electron').remote;
const appDataPath = path.resolve(app.getPath('userData'));
const isDev = process.env.APP_DEV ? process.env.APP_DEV.trim() == 'true' : false;

//Clear Sesion Storage
sessionStorage.clear();
//Localstorage values
const SGDBKey = localStorage.getItem('SGDB_Key');
const downloadDir = localStorage.getItem('downloadDir');
const darkMode = localStorage.getItem('darkMode');

//Set SGDBKey if exists
var client;
try {
    client = new SGDB(SGDBKey);
} catch (e) {}

//Set default download location
if (!downloadDir) {
    //Using path resolve to convert for windows
    localStorage.setItem('downloadDir', path.join(appDataPath, 'Games'));
}

//Darkmode by default
if (!darkMode) {
    localStorage.setItem('darkMode', true);
}

//If library json file doesnt exist make it (and make the folder if it doesnt exist)
var file = path.join(appDataPath, 'Json/library.json');
fs.readFile(file, 'utf-8', (err, data) => {
    if (err) {
        fs.mkdir(path.join(appDataPath, 'Json'), {recursive: true}, (err) => {
            if (err) throw err;
            fs.appendFile(file, '', function (err) {
                if (err) throw err;
            });
        });
        return;
    }
});

//Console log dev only
function devLog(log) {
    if (isDev) {
        console.log('DevLog', log);
    }
    return;
}
devLog('Hi Developer');
