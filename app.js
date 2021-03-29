const path = require('path');
const electron = require('electron');
const root = electron.app.getAppPath();
const {ipcMain, app, BrowserWindow, dialog} = require('electron');
const isDev = require('electron-is-dev');
const {spawn} = require('child_process');

const spawnMain = async () => {
    const win = new BrowserWindow({
        // backgroundColor: '#121212',
        frame: false,
        minWidth: 990,
        minHeight: 670,
        show: false,
        icon: root + '/assets/icons/png/icon.png',
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
        },
    });

    win.setMenuBarVisibility(false);
    win.loadFile('./app/html/index.html');
    return win;
};

const spawnLoading = async () => {
    win = new BrowserWindow({
        frame: false,
        transparent: true,
        width: 500,
        height: 500,
        icon: root + '/assets/icons/png/icon.png',
    });

    win.setMenuBarVisibility(false);
    win.setResizable(false);
    win.loadFile('./app/html/loading.html');
    return win;
};

electron.app.on('ready', () => setTimeout(() => startApp(), process.platform == 'linux' ? 1000 : 0));

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

const startApp = async () => {
    const main = await spawnMain();
    const loading = await spawnLoading();

    checkForSingleInstance(main);

    ipcMain.once('loaded', () => {
        main.show();
        loading.close();
    });
};

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) startApp();
});

function checkForSingleInstance(window) {
    // # Make app single instance
    const SingleInstance = app.requestSingleInstanceLock();
    if (!SingleInstance) {
        app.quit();
    } else {
        app.on('second-instance', () => {
            if (!window) return;
            if (window.isMinimized()) window.restore();
            window.focus();
        });
    }
}

if (isDev) {
    require('electron-reload')(__dirname, {
        ignored: [path.join(__dirname, 'app', 'scss'), path.join(__dirname, 'app', 'json')],
        electron: path.join(__dirname, 'node_modules', '.bin', 'electron'),
    });
}
