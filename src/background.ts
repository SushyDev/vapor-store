'use strict';

import {app, protocol, BrowserWindow, ipcMain} from 'electron';
import {createProtocol} from 'vue-cli-plugin-electron-builder/lib';
import installExtension, {VUEJS_DEVTOOLS} from 'electron-devtools-installer';
const isDevelopment = process.env.NODE_ENV !== 'production';

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{scheme: 'app', privileges: {secure: true, standard: true}}]);

async function spawnMain() {
    // Create the browser window.
    const win = new BrowserWindow({
        frame: false,
        minWidth: 990,
        minHeight: 670,
        show: false,
        webPreferences: {
            enableRemoteModule: true,
            nodeIntegration: (process.env.ELECTRON_NODE_INTEGRATION as unknown) as boolean,
        },
    });

    win.setMenuBarVisibility(false);

    if (process.env.WEBPACK_DEV_SERVER_URL) {
        // Load the url of the dev server if in development mode
        await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string);
        if (!process.env.IS_TEST) win.webContents.openDevTools();
    } else {
        createProtocol('app');
        // Load the index.html when not in development
        win.loadURL('app://./index.html');
    }

    return win;
}

async function spawnLoading() {
    const win = new BrowserWindow({
        frame: false,
        transparent: true,
        width: 500,
        height: 500,
    });

    win.setMenuBarVisibility(false);
    win.setResizable(false);

    if (process.env.WEBPACK_DEV_SERVER_URL) {
        // Load the url of the dev server if in development mode
        await win.loadURL('http://localhost:1234/loading.html');
    } else {
        win.loadURL('app://./loading.html');
    }

    return win;
}

app.on('window-all-closed', () => app.quit());

const startApp = async () => {
    const main = await spawnMain();
    const loading = await spawnLoading();

    checkForSingleInstance(main);

    ipcMain.once('loaded', () => {
        main.show();
        loading.close();
    });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
    if (isDevelopment && !process.env.IS_TEST) {
        // Install Vue Devtools
        try {
            await installExtension(VUEJS_DEVTOOLS);
        } catch (e) {
            console.error('Vue Devtools failed to install:', e.toString());
        }
    }

    setTimeout(() => startApp(), process.platform == 'linux' ? 1000 : 0);
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
    process.on('SIGTERM', () => {
        app.quit();
    });
}

function checkForSingleInstance(window: any) {
    // # Make app single instance
    const SingleInstance = app.requestSingleInstanceLock();
    if (!SingleInstance) {
        app.quit();
    } else {
        app.on('second-instance', () => {
            console.log('single');
            if (!window) return;
            if (window.isMinimized()) window.restore();
            window.focus();
        });
    }
}
