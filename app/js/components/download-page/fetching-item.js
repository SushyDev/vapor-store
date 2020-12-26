function createFetchingItem(gameTitle) {
    let item = document.createElement('div');
    item.className = 'fetch-item downloader-list-item';
    item.id = `${gameTitle}-fetch-item`;
    item.innerHTML = `
     <div class="download-item-body mdc-ripple-surface" data-mdc-auto-init="MDCRipple" onclick="selectDownload(this); addMetadata('${gameTitle}', 'downloader')">
            <div class="download-item-content">
                <div class="title-desc">
                    <h1 class="mdc-typography--headline4" id="${gameTitle}-fetch-title">Fetching download</h1>
                     <h3 class="mdc-typography--body2">${gameTitle}</h3>
                </div>
                <div role="progressbar" class="mdc-linear-progress" id="${gameTitle}-fetch-progress" aria-valuemin="0" aria-valuemax="1" data-mdc-auto-init="MDCLinearProgress">
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
        <hr class="mdc-list-divider" />
    `;

    try {
        document.getElementById('download-item-container').appendChild(item);
    } catch (e) {}

    window.mdc.autoInit();
}

ipcMain.on('item-fetching-progress', (e, gameTitle, progress) => {
    try {
        var progressBar = document.getElementById(`${gameTitle}-fetch-progress`);
        var mlp = new mdc.linearProgress.MDCLinearProgress(progressBar);
        mlp.progress = progress;
    } catch (e) {}
});

ipcMain.on('item-fetching-complete', (event, gameTitle) => {
    removeItem(gameTitle, 'fetch');
});
