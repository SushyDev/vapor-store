function selectDownload(elem) {
    var container = elem.closest('.download-item');

    try {
        document.querySelector('.active').classList.remove('active');
    } catch (e) {}

    container.classList.add('active');

    document.getElementById('game-info-content').style.display = 'initial';
}
var testarray = [
    {
        fullPath: '/home/sushy/.config/vapor-store/Games/Emily.Wants.To.Play.zip',
        gameTitle: 'emily-wants-to-play',
        url: 'https://download141.uploadhaven.com/1/application/zip/2W6qYYUEHTH1MLaUn6FPlQiIGRi3T4DlalhsyNWu.zip?key=jVNb5AFo81-fYy1I8dlWZA&expire=1608998764&filename=Emily.Wants.To.Play.zip',
        zipFile: 'Emily.Wants.To.Play.zip',
    },
];
function downloadPause(name) {
    if (document.getElementById(`${name}-downloader-pause-button__label`).innerHTML == 'Pause') {
        ipcRenderer.sendTo(mainWindow.id, `${name}-pause`);
        document.getElementById(`${name}-downloader-pause-button__label`).innerHTML = 'Resume';
    } else {
        ipcRenderer.sendTo(mainWindow.id, `${name}-resume`);
        document.getElementById(`${name}-downloader-pause-button__label`).innerHTML = 'Pause';
    }
}

//Cancel download
async function downloadCancel(name, alert, message) {
    //if pressed cancel dont continue
    if (!closeSnackbar(`${name}-download`, alert, message));
    //set canceled in localstorage
    ipcRenderer.sendTo(mainWindow.id, `${name}-cancel`);

    removeItem(name, 'download');
}