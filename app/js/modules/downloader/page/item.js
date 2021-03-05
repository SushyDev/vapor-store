exports.createDownloadItem = (game) => {
    const item = document.createElement('div');
    item.className = 'download download-item';
    item.id = `${game.gameID}-download-item`;
    item.innerHTML = `
<div class="download-item-body mdc-ripple-surface" data-mdc-auto-init="MDCRipple" onclick="downloader.item.selectItem(this); vapor.cards.build.addMetadata('${game.gameID}', 'downloader')">
    <div class="download-item-content">
        <div class="title-desc">
            <h1 class="mdc-typography--headline4" id="${game.gameID}-zipfile">${game.zipFile}</h1>
            <h3 class="mdc-typography--body2" id="${game.gameID}-download-info"></h3>
        </div>
        <div role="progressbar" class="mdc-linear-progress" id="${game.gameID}-progress" aria-valuemin="0" aria-valuemax="1" data-mdc-auto-init="MDCLinearProgress">
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
<div class="download-item-actions" id="${game.gameID}-download-item-actions">
    <button class="mdc-button" data-mdc-auto-init="MDCRipple" onclick="downloader.item.pauseItem('${game.gameID}')">
        <div class="mdc-button__ripple"></div>
        <span class="mdc-button__label" id="${game.gameID}-downloader-pause-button__label">Pause</span>
    </button>
    <button class="mdc-button" data-mdc-auto-init="MDCRipple" onclick="downloader.item.cancelItem('${game.gameID}', true, 'Are you sure you want to cancel the download for ${game.gameID}')">
        <div class="mdc-button__ripple"></div>
        <span class="mdc-button__label">Cancel</span>
    </button>
</div>
<hr class="mdc-list-divider" />`;

    if (sessionStorage.getItem('page') == 'Downloads') document.getElementById('downloads-list').appendChild(item);

    window.mdc.autoInit();
};

exports.checkCurrentExtractions = () => {
    currentExtractions.forEach((game) => {
        if (!document.getElementById(`${game}-extraction-item`)) downloader.item.createExtractingItem(game);
    });
};

exports.checkConfirmExtract = () => {
    extractNeedsConfirm.forEach((game) => {
        if (!document.getElementById(`${game.gameID}-extraction-item`)) downloader.item.createConfirmExtract(game);
    });
};

// ! Run this in initialize? checkConfirmExtract();

exports.createExtractingItem = (gameID) => {
    const item = document.createElement('div');
    item.className = 'extraction download-item';
    item.id = `${gameID}-extraction-item`;
    item.innerHTML = `
     <div class="download-item-body mdc-ripple-surface" data-mdc-auto-init="MDCRipple" onclick="downloader.item.selectItem(this); vapor.cards.build.addMetadata('${gameID}', 'downloader')">
            <div class="download-item-content">
                <div class="title-desc">
                    <h1 class="mdc-typography--headline4" id="${gameID}-extraction-title">Extracting file</h1>
                     <h3 class="mdc-typography--body2">${gameID}</h3>
                </div>
                <div role="progressbar" class="mdc-linear-progress" id="${gameID}-extraction-progress" aria-valuemin="0" aria-valuemax="1" data-mdc-auto-init="MDCLinearProgress">
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

    if (sessionStorage.getItem('page') == 'Downloads') document.getElementById('downloads-list').appendChild(item);

    window.mdc.autoInit();
};

exports.createConfirmExtract = (game) => {
    const fullPath = game.fullPath;
    const targetFolder = game.targetFolder;

    if (!!document.getElementById(`${game.gameID}-confirm-item`)) return;

    const folderName = targetFolder.split(path.sep).pop();
    const zipFile = folderName + '.zip';

    const item = document.createElement('div');
    item.className = 'confirm download-item';
    item.id = `${game.gameID}-confirm-item`;
    item.innerHTML = `
<div class="download-item-body mdc-ripple-surface" data-mdc-auto-init="MDCRipple" onclick="downloader.item.selectItem(this); vapor.cards.build.addMetadata('${game.gameID}', 'downloader')">
    <div class="download-item-content">
        <div class="title-desc">
            <h1 class="mdc-typography--headline4" id="${game.gameID}-extraction-title">Extracting file</h1>
            <h3 class="mdc-typography--body2">${game.gameID}</h3>
        </div>
        <div role="progressbar" class="mdc-linear-progress" id="${game.gameID}-extraction-progress" aria-valuemin="0" aria-valuemax="1" data-mdc-auto-init="MDCLinearProgress">
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
    <button class="mdc-button" data-mdc-auto-init="MDCRipple" onclick="downloader.extractDownload('${fullPath.replace(/\\/g, '/')}', '${targetFolder.replace(/\\/g, '/')}', '${game.gameID}'); downloader.item.removeItem('${game.gameID}', 'confirm')">
        <div class="mdc-button__ripple"></div>
        <span class="mdc-button__label">Extract</span>
    </button>
    <button class="mdc-button" data-mdc-auto-init="MDCRipple" onclick="downloader.extractDownload('${game.gameID}-extract-confirm', true, 'Are you sure you dont want to extract ${zipFile}', '${game.gameID}')">
        <div class="mdc-button__ripple"></div>
        <span class="mdc-button__label">Cancel</span>
    </button>
</div>
<hr class="mdc-list-divider" />
    `;

    if (sessionStorage.getItem('page') == 'Downloads') document.getElementById('downloads-list').appendChild(item);

    window.mdc.autoInit();
};

exports.cancelExtract = async (name, alert, message, gameTitle) => {
    //if pressed cancel dont continue
    if (!closeSnackbar(`${name}`, alert, message)) return;

    const indexNum = extractNeedsConfirm.findIndex((key) => key.gameTitle === gameTitle);

    delete extractNeedsConfirm[indexNum];

    extractNeedsConfirm = extractNeedsConfirm.filter((n) => n);

    downloader.item.removeItem(gameTitle, 'confirm');
};

exports.createFetchingItem = (gameID) => {
    const item = document.createElement('div');
    item.className = 'fetch download-item';
    item.id = `${gameID}-fetch-item`;
    item.innerHTML = `
     <div class="download-item-body mdc-ripple-surface" data-mdc-auto-init="MDCRipple" onclick="downloader.item.selectItem(this); vapor.cards.build.addMetadata('${gameID}', 'downloader')">
            <div class="download-item-content">
                <div class="title-desc">
                    <h1 class="mdc-typography--headline4" id="${gameID}-fetch-title">Fetching download</h1>
                     <h3 class="mdc-typography--body2">${gameID}</h3>
                </div>
                <div role="progressbar" class="mdc-linear-progress" id="${gameID}-fetch-progress" aria-valuemin="0" aria-valuemax="1" data-mdc-auto-init="MDCLinearProgress">
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

    if (sessionStorage.getItem('page') == 'Downloads') document.getElementById('downloads-list').appendChild(item);

    window.mdc.autoInit();
};

exports.removeItem = (gameTitle, type) => {
    if (sessionStorage.getItem('page') == 'Downloads') document.getElementById(`${gameTitle}-${type}-item`).remove();
};

exports.selectItem = (elem) => {
    const container = elem.closest('.download-item');

    try {
        document.querySelector('.active').classList.remove('active');
    } catch (e) {
        // ! Item doesn't exist
    }

    container.classList.add('active');
    document.getElementById('download-item-info').style.display = 'initial';
};

exports.pauseItem = (name) => {
    if (document.getElementById(`${name}-downloader-pause-button__label`).innerHTML == 'Pause') {
        ipcRenderer.sendTo(mainWindow.id, `${name}-pause`);
        document.getElementById(`${name}-downloader-pause-button__label`).innerHTML = 'Resume';
    } else {
        ipcRenderer.sendTo(mainWindow.id, `${name}-resume`);
        document.getElementById(`${name}-downloader-pause-button__label`).innerHTML = 'Pause';
    }
};

exports.cancelItem = async (name, alert, message) => {
    //if pressed cancel dont continue
    if (!vapor.ui.snackbar.close(`${name}-download`, alert, message)) return;
    //set canceled in localstorage

    ipcRenderer.sendTo(mainWindow.id, `${name}-cancel`);

    downloader.item.removeItem(name, 'download');
};

exports.addItem = () => {
    vapor.ui.dialog.MDCAlert('Not implemented yet', 'Please wait for future updates');
    // startDownload(url, localStorage.getItem('downloadDir'), gameTitle);
};
