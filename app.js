const path = require('path');
const electron = require('electron');
const root = electron.app.getAppPath();
const {ipcMain, app, BrowserWindow, dialog} = require('electron');
const ElectronDL = require('electron-dl');
const isDev = require('electron-is-dev');

function spawnWindow() {
    win = new BrowserWindow({
        backgroundColor: '#121212',
        frame: false,
        minWidth: 990,
        minHeight: 670,
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

//Make app single instance
const SingleInstance = app.requestSingleInstanceLock();
if (!SingleInstance) {
    app.quit();
} else {
    app.on('second-instance', (event, commandLine, workingDirectory) => {
        // Someone tried to run a second instance, we should focus our window.
        if (window) {
            if (window.isMinimized()) window.restore();
            window.focus();
        }
    });
}
/*
if (isDev) {
    require('electron-reload')(__dirname, {
        ignored: [path.join(__dirname, 'app', 'scss'), path.join(__dirname, 'app', 'json')],
        electron: path.join(__dirname, 'node_modules', '.bin', 'electron'),
    });
}
*/