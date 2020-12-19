var started = [];

function startDownload(url, dir, gameTitle) {
    var {download} = require('electron').remote.require('electron-dl');
    download(mainWindow, url, {
        directory: dir,
        allowOverwrite: true,
        onStarted: (item) => {
            if (started.includes(gameTitle)) return;
            started.push(gameTitle);

            var fileName = item.getFilename();
            var fullPath = path.join(localStorage.getItem('downloadDir'), fileName);
            var name = fileName.slice(0, -4);
            var fileurl = item.getURL();
            var fileType = fileName.substr(-3);

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
                        innerHTML: `Downloading ${fileName} 0%`,
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
                        onclick: `cancelDownload('${name}', true, 'Are you sure you want to cancel the download for ${fileName}', '${fullPath.replace(/\\/g, '/')}')`,
                        title: 'Cancel',
                        icon: 'close',
                        id: `${name}-close`,
                    },
                ],
            };

            //Remove starting snackbar
            if (!gameTitle.includes('vapor-store-update')) closeSnackbar(`${gameTitle}-download-starting`, false);

            //Create snackbar
            createSnack(snackbarData);

            ipcRenderer.on(`${name}-pause`, () => {
                item.pause();
            });

            ipcRenderer.on(`${name}-resume`, () => {
                item.resume();
            });
            ipcRenderer.on(`${name}-cancel`, () => {
                item.cancel();
                downloading.shift();
                //remove zip file
                fs.unink(fullPath, (err) => {
                    if (err) {
                        console.error(err);
                    }
                });
                //Stop
                return;
            });

            //On incoming data
            item.on('updated', (event, state) => {
                try {
                    //Downloading
                    var received_bytes = item.getReceivedBytes();
                    var total_bytes = item.getTotalBytes();

                    var downloadPercent = (received_bytes * 100) / total_bytes;
                    var scalePercent = downloadPercent / 100;

                    document.getElementById(`${name}-completed-progress`).style.transform = `scaleX(${scalePercent})`;
                    document.getElementById(`${name}-snackbar-title`).innerHTML = `Downloading ${fileName} ${downloadPercent.toFixed(2)}%`;
                } catch (e) {
                    /* Can error on download finish so it catches here */
                }
            });

            //On download done
            item.once('done', (event, state) => {
                //On download complete
                if (state === 'completed') {
                    //Remove downloaded game from array
                    downloading.shift();

                    //Remove download snackbar
                    closeSnackbar(`${name}-download`, false);

                    //Add downloaded game to library or install update
                    if (gameTitle == 'vapor-store-update') {
                        installUpdate(fileName);
                    } else {
                        addGameToLibrary(fullPath, localStorage.getItem('downloadDir'), fileName, gameTitle);
                    }

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
                                innerHTML: `Do you want to extract ${fileName}`,
                            },
                        ],
                        ['actions']: [
                            {
                                type: 'button',
                                innerHTML: 'Yes',
                                labelid: `${name}-extract-button__label`,
                                class: 'yes-extract-button',
                                id: 'yes-extract-button',
                                onclick: `extractDownload('${fullPath.replace(/\\/g, '/')}', '${localStorage.getItem('downloadDir').replace(/\\/g, '/')}', '${fileName}', '${gameTitle}')`,
                            },
                            {
                                type: 'button',
                                innerHTML: 'No',
                                labelid: `${name}-close-button__label`,
                                class: 'no-extract-button',
                                id: 'no-extract-button',
                                onclick: `closeSnackbar('${name}-extractyn', true, "Are you sure you don't want to extract ${fileName}")`,
                            },
                        ],
                        ['close']: [
                            {
                                enabled: false,
                            },
                        ],
                    };

                    //Extract downloaded zip file
                    if (fileType == 'zip') createSnack(snackbarData);
                } else {
                    //Download didnt complete
                    console.log(`Download failed: ${state}`);
                }
            });
        },
    });
}

//Pause / resume download
function pauseDownload(name) {
    if (document.getElementById(`${name}-pause-button__label`).innerHTML == 'Pause') {
        ipcRenderer.sendTo(mainWindow.id, `${name}-pause`);
        document.getElementById(`${name}-pause-button__label`).innerHTML = 'Resume';
    } else {
        ipcRenderer.sendTo(mainWindow.id, `${name}-resume`);
        document.getElementById(`${name}-pause-button__label`).innerHTML = 'Pause';
    }
}

//Cancel download
function cancelDownload(name, alert, message, targetPath) {
    //if pressed cancel dont continue
    if (!closeSnackbar(`${name}-download`, alert, message)) return;
    //set canceled in localstorage
    ipcRenderer.sendTo(mainWindow.id, `${name}-cancel`);
}
