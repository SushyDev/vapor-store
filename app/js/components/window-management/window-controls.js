const getWindow = () => remote.BrowserWindow.getFocusedWindow();

function winMinimize() {
    getWindow().minimize();
}
function winMaximize() {
    const window = getWindow();
    window.isMaximized() ? window.unmaximize() : window.maximize();
}
function winClose() {
    mainWindow.close();
}