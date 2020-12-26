function checkCurrentDownloads() {
    //Add new downloading items
    currentDownloadData.forEach((game) => {
        if (!document.getElementById(`${game.gameTitle}-download-item`)) createDownloadItem(game);
    });
}

function createDownloadItem(game) {
    let item = document.createElement('div');
    item.className = 'download-item downloader-list-item';
    item.id = `${game.gameTitle}-download-item`;
    item.innerHTML = `
<div class="download-item-body mdc-ripple-surface" data-mdc-auto-init="MDCRipple" onclick="selectDownload(this); addMetadata('${game.gameTitle}', 'downloader')">
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
    <button class="mdc-button" data-mdc-auto-init="MDCRipple" onclick="downloadPause('${game.gameTitle}')">
        <div class="mdc-button__ripple"></div>
        <span class="mdc-button__label" id="${game.gameTitle}-downloader-pause-button__label">Pause</span>
    </button>
    <button class="mdc-button" data-mdc-auto-init="MDCRipple" onclick="downloadCancel('${game.gameTitle}', true, 'Are you sure you want to cancel the download for ${game.zipFile}')">
        <div class="mdc-button__ripple"></div>
        <span class="mdc-button__label">Cancel</span>
    </button>
</div>
<hr class="mdc-list-divider" />

    `;

    try {
        document.getElementById('download-item-container').appendChild(item);
    } catch (e) {}

    window.mdc.autoInit();
}

ipcMain.on('item-updated-data', (e, item, data, gameTitle) => {
    checkCurrentDownloads();

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

    try {
        var downloadInfo = document.getElementById(`${gameTitle}-download-info`);
        downloadInfo.innerHTML = `${downloadPercent.toFixed(2)}% | ${MBps.toFixed(2)}MB/s | ${GB.toFixed(2)}GB/${totalGB.toFixed(2)}GB`;
        var progress = document.getElementById(`${gameTitle}-progress`);
        var mlp = new mdc.linearProgress.MDCLinearProgress(progress);
        mlp.progress = scalePercent;
    } catch (e) {}
});

ipcMain.on('item-download-completed', (event, gameTitle) => {
    try {
        removeItem(gameTitle, 'download');
    } catch (e) {}
});
