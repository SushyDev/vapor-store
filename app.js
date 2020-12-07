const path = require('path');
const electron = require('electron');
const root = electron.app.getAppPath();
const {ipcMain, app, BrowserWindow, dialog} = require('electron');
const {download} = require('electron-dl');
var isDev = process.env.APP_DEV ? process.env.APP_DEV.trim() == 'true' : false;

function spawnWindow() {
    win = new BrowserWindow({
        backgroundColor: '#121212',
        frame: false,
        minWidth: 835,
        minHeight: 550,
        icon: root + '/assets/icons/png/icon.png',
        webPreferences: {
            nodeIntegration: true,
        },
    });

    win.setMenuBarVisibility(false);
    win.loadFile('./app/html/index.html');
    return win;
}

var window;
electron.app.on('ready', () => {
    setTimeout(
        () => {
            window = spawnWindow();
        },
        process.platform == 'linux' ? 1000 : 0
    );
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        spawnWindow();
    }
});

ipcMain.on('download-item', async (event, url, dir, gameTitle) => {
    await download(window, url, {
        directory: dir,
    });
    event.sender.send(`${url}-download-success`, gameTitle);
});

if (isDev) {
    require('electron-reload')(__dirname, {
        ignored: [path.join(__dirname, 'app', 'scss'), path.join(__dirname, 'app', 'json')],
        electron: path.join(__dirname, 'node_modules', '.bin', 'electron'),
    });
}
