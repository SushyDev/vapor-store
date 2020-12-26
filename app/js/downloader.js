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

//document.getElementById('download-item-container').innerHTML = ''
onGoingDownloads.forEach((game) => {
    createDownloadItem(game);
});

function createDownloadItem(game) {
    let item = document.createElement('div');
    item.className = 'download-item';
    item.id = `${game.gameTitle}-download-item`
    item.innerHTML = `
     <div class="download-item-body mdc-ripple-surface" data-mdc-auto-init="MDCRipple" id="assetto-corsa-download" onclick="selectDownload(this); addMetadata('${game.gameTitle}', 'downloader')">
            <div class="download-item-content">
                <div class="title-desc">
                    <h1 class="mdc-typography--headline4" id="${game.gameTitle}-zipfile">${game.zipFile}</h1>
                    <h3 class="mdc-typography--body2" id="${game.gameTitle}-download-info"></h3>
                </div>
                <div role="progressbar" class="mdc-linear-progress" id="${game.gameTitle}-progress" aria-valuemin="0" aria-valuemax="1" data-mdc-auto-init="MDCLinearProgress">
                    <div class="mdc-linear-progress__buffer">
                        <div class="mdc-linear-progress__buffer-bar"></div>
                        <div class="mdc-linear-progress__buffer-dots"></div>
                    </div>
                    <div class="mdc-linear-progress__bar mdc-linear-progress__primary-bar">
                        <span class="mdc-linear-progress__bar-inner"></span>
                    </div>
                    <div class="mdc-linear-progress__bar mdc-linear-progress__secondary-bar">
                        <span class="mdc-linear-progress__bar-inner"></span>
                    </div>
                </div>
            </div>
        </div>
        <div class="download-item-actions" id="${game.gameTitle}-download-item-actions">
            <button class="mdc-button" data-mdc-auto-init="MDCRipple" onclick="pauseDownload('${game.gameTitle}')">
                <div class="mdc-button__ripple"></div>
                <span class="mdc-button__label" id="${game.gameTitle}-downloader-pause-button__label">Pause</span>
            </button>
            <button class="mdc-button" data-mdc-auto-init="MDCRipple" onclick="cancelDownload('${game.gameTitle}', true, 'Are you sure you want to cancel the download for ${game.zipFile}', '${game.fullPath.replace(/\\/g, '/')}')">
                <div class="mdc-button__ripple"></div>
                <span class="mdc-button__label">Cancel</span>
            </button>

        </div>
        <hr class="mdc-list-divider" />
    `;

    document.getElementById('download-item-container').appendChild(item);

    window.mdc.autoInit();
}

ipcMain.on('item-updated-data', (e, item, data, gameTitle) => {
    var received_bytes = item.received;
    var total_bytes = item.total;

    var downloadPercent = (received_bytes * 100) / total_bytes;
    var scalePercent = downloadPercent / 100;

    //received / 1000000 / time;

    var seconds = (Date.now() - item.startTime) / 1000;
    var MB = received_bytes / (1024 * 1024);
    var GB = MB / 1024;
    var MBps = MB / seconds;
    var totalGB = total_bytes / (1024 * 1024 * 1024);

    console.log(MBps.toFixed(2));

    try {
        var downloadInfo = document.getElementById(`${gameTitle}-download-info`);
        downloadInfo.innerHTML = `${downloadPercent.toFixed(2)}% | ${MBps.toFixed(2)}MB/s | ${GB.toFixed(2)}GB/${totalGB.toFixed(2)}GB`;
        var progress = document.getElementById(`${gameTitle}-progress`);
        var mlp = new mdc.linearProgress.MDCLinearProgress(progress);
        mlp.progress = scalePercent;
    } catch (e) {
        console.log(e);
    }
});

function pauseDownload(name) {
    if (document.getElementById(`${name}-downloader-pause-button__label`).innerHTML == 'Pause') {
        ipcRenderer.sendTo(mainWindow.id, `${name}-pause`);
        document.getElementById(`${name}-downloader-pause-button__label`).innerHTML = 'Resume';
    } else {
        ipcRenderer.sendTo(mainWindow.id, `${name}-resume`);
        document.getElementById(`${name}-downloader-pause-button__label`).innerHTML = 'Pause';
    }
}

//Cancel download
async function cancelDownload(name, alert, message, targetPath) {
    //if pressed cancel dont continue
    if (!closeSnackbar(`${name}-download`, alert, message)) return;
    //set canceled in localstorage
    ipcRenderer.sendTo(mainWindow.id, `${name}-cancel`);

    goto('Downloader');
}

ipcMain.on('item-download-completed', (event, gameTitle) => {
    document.getElementById(`${gameTitle}-download-item`).remove
});
