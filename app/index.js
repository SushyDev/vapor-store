const StartOptions = {
    transparent: true,
    frame: false,
    webPreferences: {
        nodeIntegration: true,
    },
    minWidth: 764,
    minHeight: 550,
};

function init() {
    setTimeout(
        spawnWindow,
        process.platform == 'linux' ? 1000 : 0
        // Electron has a bug on linux where it
        // won't initialize properly when using
        // transparency. To work around that, it
        // is necessary to delay the window
        // spawn function.
    );
}
init();

const glasstron = require('glasstron');
const electron = require('electron');
electron.app.commandLine.appendSwitch('enable-transparent-visuals');

const path = require('path');

require('electron-reload')(__dirname, {
    ignored: path.join(__dirname, 'src', 'scss'),
    electron: path.join(__dirname, 'node_modules', '.bin', 'electron'),
});

function spawnWindow() {
    win = new glasstron.BrowserWindow(StartOptions);
    win.blurType = 'acrylic';
    //              ^~~~~~~
    // Windows 10 1803+; for older versions you
    // might want to use 'blurbehind'
    win.setBlur(true);
    win.loadFile('./src/html/index.html');
    // ...
    return win;
}