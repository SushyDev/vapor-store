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
                onclick: `cancelDownload('${name}', true, 'Are you sure you want to cancel the download for ${filename}', '${fullPath.replace(/\\/g, '/')}')`,
                title: 'Cancel',
                icon: 'close',
                id: `${name}-close`,
            },
        ],
    };

    //Create snackbar
    newNotif(snackbarData);
    //Remove pause
    sessionStorage.setItem(`${name}-pause`, 'false');
    //On incoming data
    item.on('updated', (event, state) => {
        var name = filename.slice(0, -4);
        //if paused true then pause
        if (sessionStorage.getItem(`${name}-pause`) == 'true') item.pause();
        //If canceled then cancel
        if (sessionStorage.getItem(`${name}-cancel`) == 'true') {
            //Cancel download
            item.cancel();
            //remove from current downloading list
            downloading.shift();
            //remove zip file
            fs.unink(fullPath, (err) => {
                if (err) {
                    console.error(err);
                }
            });
            //Stop
            return;
        }

        if (state === 'progressing') {
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
                    /* Can error on download finish so it catches here */
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
            console.log(`Download failed: ${state}`);
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

//Cancel download
function cancelDownload(name, alert, message, targetPath) {
    //if pressed cancel dont continue
    if (!closeSnackbar(`${name}-download`, alert, message)) return;
    //set canceled in localstorage
    sessionStorage.setItem(`${name}-cancel`, 'true');
}
