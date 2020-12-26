function checkCurrentExtractions() {
    currentExtractions.forEach((game) => {
        if (!document.getElementById(`${game}-extraction-item`)) createExtractingItem(game);
    });
}

function createExtractingItem(gameTitle) {
    let item = document.createElement('div');
    item.className = 'extraction-item downloader-list-item';
    item.id = `${gameTitle}-extraction-item`;
    item.innerHTML = `
     <div class="download-item-body mdc-ripple-surface" data-mdc-auto-init="MDCRipple" onclick="selectDownload(this); addMetadata('${gameTitle}', 'downloader')">
            <div class="download-item-content">
                <div class="title-desc">
                    <h1 class="mdc-typography--headline4" id="${gameTitle}-extraction-title">Extracting file</h1>
                     <h3 class="mdc-typography--body2">${gameTitle}</h3>
                </div>
                <div role="progressbar" class="mdc-linear-progress" id="${gameTitle}-extraction-progress" aria-valuemin="0" aria-valuemax="1" data-mdc-auto-init="MDCLinearProgress">
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

ipcMain.on('item-extraction-progress', (e, gameTitle, zipFile, progress) => {
    checkCurrentExtractions();

    var scalePercent = progress / 100;
    try {
        var progressBar = document.getElementById(`${gameTitle}-extraction-progress`);
        var mlp = new mdc.linearProgress.MDCLinearProgress(progressBar);
        mlp.progress = scalePercent;
    } catch (e) {}
});

ipcMain.on('item-extraction-complete', (event, gameTitle) => {
    removeItem(gameTitle, 'extraction');
});

function checkConfirmExtract() {
    extractNeedsConfirm.forEach((game) => {
        if (!document.getElementById(`${game.gameTitle}-extraction-item`)) createConfirmExtract(game);
    });
}
checkConfirmExtract();

ipcMain.on('item-extraction-confirm', () => {
    checkConfirmExtract();
});

function createConfirmExtract(game) {
    var gameTitle = game.gameTitle;
    var fullPath = game.fullPath;
    var targetFolder = game.targetFolder;

    if (!!document.getElementById(`${gameTitle}-confirm-item`)) return;

    var folderName = targetFolder.split(path.sep).pop();
    var zipFile = folderName + '.zip';

    let item = document.createElement('div');
    item.className = 'confirm-item downloader-list-item';
    item.id = `${gameTitle}-confirm-item`;
    item.innerHTML = `
<div class="download-item-body mdc-ripple-surface" data-mdc-auto-init="MDCRipple" onclick="selectDownload(this); addMetadata('${gameTitle}', 'downloader')">
    <div class="download-item-content">
        <div class="title-desc">
            <h1 class="mdc-typography--headline4" id="${gameTitle}-extraction-title">Extracting file</h1>
            <h3 class="mdc-typography--body2">${gameTitle}</h3>
        </div>
        <div role="progressbar" class="mdc-linear-progress" id="${gameTitle}-extraction-progress" aria-valuemin="0" aria-valuemax="1" data-mdc-auto-init="MDCLinearProgress">
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
<div class="download-item-actions">
    <button class="mdc-button" data-mdc-auto-init="MDCRipple" onclick="extractDownload('${fullPath.replace(/\\/g, '/')}', '${targetFolder.replace(/\\/g, '/')}', '${gameTitle}'); removeItem('${gameTitle}', 'confirm')">
        <div class="mdc-button__ripple"></div>
        <span class="mdc-button__label">Extract</span>
    </button>
    <button class="mdc-button" data-mdc-auto-init="MDCRipple" onclick="cancelExtract('${gameTitle}-extractyn', true, 'Are you sure you dont want to extract ${zipFile}', '${gameTitle}')">
        <div class="mdc-button__ripple"></div>
        <span class="mdc-button__label">Cancel</span>
    </button>
</div>
<hr class="mdc-list-divider" />
    `;

    document.getElementById('download-item-container').appendChild(item);

    window.mdc.autoInit();
}

async function cancelExtract(name, alert, message, gameTitle) {
    //if pressed cancel dont continue
    if (!closeSnackbar(`${name}`, alert, message)) return;

    var indexNum = extractNeedsConfirm.findIndex((key) => key.gameTitle === gameTitle);

    delete extractNeedsConfirm[indexNum];

    extractNeedsConfirm = extractNeedsConfirm.filter((n) => n);

    removeItem(gameTitle, 'confirm');
}
