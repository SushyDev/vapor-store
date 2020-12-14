//Downloading progress
win.webContents.session.on('will-download', (event, item, webContents) => {
    var filename = item.getFilename();
    var fullPath = path.join(localStorage.getItem('downloadDir'), filename);
    var name = filename.slice(0, -4);
    var fileurl = item.getURL();
    var fileType = filename.substr(-3);
    //Dont pause on start

    var snackbarData = {
        ['main']: [
            {
                name: `${name}-download`,
            },
        ],
        ['progress']: [
            {
                enabled: true,
                id: `${name}-completed-progress`,
            },
        ],
        ['label']: [
            {
                id: `${name}-snackbar-title`,
                innerHTML: `${filename} 0%`,
            },
        ],
        ['actions']: [
            {
                type: 'button',
                innerHTML: 'Pause',
                labelid: `${name}-pause-button__label`,
                class: 'pause-button',
                id: 'pause-button',
                onclick: `pauseDownload('${name}')`,
            },
        ],
        ['close']: [
            {
                enabled: true,
                onclick: `closeSnackbar('${name}-download', true, 'Are you sure you want to cancel the download for ${filename}')`,
                title: 'Cancel',
                icon: 'close',
                id: `${name}-close`,
            },
        ],
    };

    newNotif(snackbarData);

    sessionStorage.setItem(`${name}-pause`, 'false');

    //Create snackbar

    item.on('updated', (event, state) => {
        var name = filename.slice(0, -4);
        //if paused true then pause
        if (sessionStorage.getItem(`${name}-pause`) == 'true') item.pause();

        //If canceled then cancel
        if (sessionStorage.getItem(`${name}-cancel`) == 'true') {
            item.cancel();
            return;
        }

        if (state === 'interrupted') {
            //Download is interrupted but can be resumed
        } else if (state === 'progressing') {
            //if paused
            if (item.isPaused()) {
                setInterval(() => {
                    //if value false resume
                    if (sessionStorage.getItem(`${name}-pause`) == 'false') {
                        try {
                            item.resume();
                        } catch (e) {
                            return; /* fix memory leak hopefully */
                        }
                    }
                }, 100);
            } else {
                try {
                    //Downloading
                    var received_bytes = item.getReceivedBytes();
                    var total_bytes = item.getTotalBytes();

                    var downloadPercent = (received_bytes * 100) / total_bytes;
                    var scalePercent = downloadPercent / 100;

                    document.getElementById(`${name}-completed-progress`).style.transform = `scaleX(${scalePercent})`;
                    document.getElementById(`${name}-snackbar-title`).innerHTML = `${filename} ${downloadPercent.toFixed(2)}%`;
                } catch (e) {
                    /* Can error on download finish so it catches ehre */
                }
            }
        }
    });

    //On download done
    item.once('done', (event, state) => {
        if (state === 'completed') {
            //On download complete
            ipcRenderer.on(`${fileurl}-download-success`, (event, gameTitle) => {
                //Remove downloaded game from array
                downloading.shift();

                //Remove download snackbar
                closeSnackbar(`${name}-download`, false);

                //Add downloaded game to library
                addGameToLibrary(fullPath, localStorage.getItem('downloadDir'), filename, gameTitle);

                var snackbarData = {
                    ['main']: [
                        {
                            name: `${name}-extractyn`,
                        },
                    ],
                    ['progress']: [
                        {
                            enabled: false,
                        },
                    ],
                    ['label']: [
                        {
                            id: `${name}-snackbar-title`,
                            innerHTML: `Do you want to extract ${filename}`,
                        },
                    ],
                    ['actions']: [
                        {
                            type: 'button',
                            innerHTML: 'Yes',
                            labelid: `${name}-extract-button__label`,
                            class: 'yes-extract-button',
                            id: 'yes-extract-button',
                            onclick: `extractDownload('${fullPath.replace(/\\/g, '/')}', '${localStorage.getItem('downloadDir').replace(/\\/g, '/')}', '${filename}', '${gameTitle}')`,
                        },
                        {
                            type: 'button',
                            innerHTML: 'No',
                            labelid: `${name}-close-button__label`,
                            class: 'no-extract-button',
                            id: 'no-extract-button',
                            onclick: `closeSnackbar('${name}-extractyn', true, 'Are you sure you don't want to extract ${filename})`,
                        },
                    ],
                    ['close']: [
                        {
                            enabled: false,
                        },
                    ],
                };

                //Extract downloaded zip file
                if (fileType == 'zip') {
                    newNotif(snackbarData);
                }
            });
        } else {
            devLog(`Download failed: ${state}`);
        }
    });
});

//Pause / resume
function pauseDownload(name) {
    if (sessionStorage.getItem(`${name}-pause`) == 'false') {
        sessionStorage.setItem(`${name}-pause`, 'true');
        document.getElementById(`${name}-pause-button__label`).innerHTML = 'Resume';
    } else {
        sessionStorage.setItem(`${name}-pause`, 'false');
        document.getElementById(`${name}-pause-button__label`).innerHTML = 'Pause';
    }
}

function cancelDownload(name, message) {
    closeSnackbar(name, message);
    sessionStorage.setItem(`${name}-cancel`, 'true');
}

//Create snackbar
function createSnackbar(name) {
    var card = document.createElement('div');
    card.id = name + '-snackbar';
    card.className = 'mdc-snackbar mdc-snackbar--leading mdc-snackbar--open';
    card.innerHTML = `

                        <div class="mdc-snackbar__surface snack-flex">
                            <!--Progress-->
                            <div role="progressbar" class="mdc-linear-progress">
                                <div class="mdc-linear-progress__buffering-dots"></div>
                                <div class="mdc-linear-progress__buffer" style="transform: scaleX(0.75)"></div>
                                <div class="mdc-linear-progress__bar mdc-linear-progress__primary-bar" id="${name}-completed-progress"><span class="mdc-linear-progress__bar-inner"></span></div>
                                <div class="mdc-linear-progress__bar mdc-linear-progress__secondary-bar"><span class="mdc-linear-progress__bar-inner"></span></div>
                            </div>
                            <!--/Progress-->

                            <div class="snack-content">
                                <div class="mdc-snackbar__label" role="status" aria-live="polite" id="${name}-snackbar-title">${name}.zip 0.0%</div>
                                <div class="mdc-snackbar__actions" id="${name}-snack-actions">
                                    <button type="button" class="mdc-button mdc-snackbar__action" onclick="pauseDownload('${name}')" data-mdc-auto-init="MDCRipple">
                                        <div class="mdc-button__ripple"></div>
                                        <div class="mdc-button__label" id="${name}-pause-button__label">Pause</div>
                                    </button>
                                    <button class="mdc-icon-button mdc-snackbar__dismiss material-icons" title="Dismiss" onclick="closeSnackbar('${name}')">close</button>
                                </div>
                            </div>
                        </div>
`;
    document.getElementById('download-snackbar-container').appendChild(card);
    window.mdc.autoInit();
}
