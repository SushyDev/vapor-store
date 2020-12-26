function selectDownload(elem) {
    var container = elem.closest('.download-item');

    try {
        document.querySelector('.active').classList.remove('active');
    } catch (e) {}

    container.classList.add('active');

    document.getElementById('download-item-info').style.display = 'initial';
}

function removeItem(gameTitle, type) {
    try {
        document.getElementById(`${gameTitle}-${type}-item`).remove();
    } catch (e) {}
}

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
    if (!closeSnackbar(`${name}-download`, alert, message)) return;
    //set canceled in localstorage
    ipcRenderer.sendTo(mainWindow.id, `${name}-cancel`);

    removeItem(name, 'download');
}

function addDownload() {
    alert('Not implemented yet')
   // startDownload(url, localStorage.getItem('downloadDir'), gameTitle);
}
