var currentDownloadName = [];
var currentDownloadData = [];
var extractNeedsConfirm = [];

function startDownload(url, dir, gameTitle) {
    var {download} = require('electron').remote.require('electron-dl');
    download(mainWindow, url, {
        directory: dir,
        allowOverwrite: true,
        onStarted: (item) => {
            if (currentDownloadName.includes(gameTitle)) return;
            currentDownloadName.push(gameTitle);

            var downloadDir = localStorage.getItem('downloadDir');
            var zipFile = item.getFilename();
            var fullPath = path.join(downloadDir, zipFile);
            var folderName = zipFile.slice(0, -4);
            var fileType = zipFile.substr(-3);
            var startTime = Date.now();

            var downloadData = {
                gameTitle: gameTitle,
                zipFile: zipFile,
                fullPath: fullPath,
                url: url,
            };

            currentDownloadData.push(downloadData);

            var snackbarData = {
                ['main']: [
                    {
                        name: `${gameTitle}-download`,
                    },
                ],
                ['progress']: [
                    {
                        id: `${gameTitle}-download-progress`,
                    },
                ],
                ['label']: [
                    {
                        id: `${gameTitle}-snackbar-title`,
                        innerHTML: `Downloading ${zipFile} 0%`,
                    },
                ],
                ['close']: [
                    {
                        onclick: `hideSnackbar('${gameTitle}-download')`,
                        title: 'Hide',
                        icon: 'keyboard_arrow_down',
                        id: `${gameTitle}-hide`,
                    },
                ],
            };

            //Remove starting snackbar
            if (!gameTitle.includes('vapor-store-update')) closeSnackbar(`${gameTitle}-fetching`, false);

            //Create snackbar
            createSnack(snackbarData);

            ipcRenderer.on(`${gameTitle}-pause`, () => {
                item.pause();
            });

            ipcRenderer.on(`${gameTitle}-resume`, () => {
                item.resume();
            });

            ipcRenderer.on(`${gameTitle}-cancel`, () => {
                item.cancel();
                //remove item from currently downloading list

                var indexNum = currentDownloadData.findIndex((key) => key.gameTitle === gameTitle);

                delete currentDownloadData[indexNum];

                currentDownloadData = currentDownloadData.filter((n) => n);

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

                    document.getElementById(`${gameTitle}-download-progress`).style.transform = `scaleX(${scalePercent})`;
                    document.getElementById(`${gameTitle}-snackbar-title`).innerHTML = `Downloading ${zipFile} ${downloadPercent.toFixed(2)}%`;

                    //Send item data to downloader
                    ipcRenderer.send('item-updated-data', {received: received_bytes, total: total_bytes, startTime: startTime}, downloadData, gameTitle);
                } catch (e) {
                    /* Can error on download finish so it catches here */
                }
            });

            //On download done
            item.once('done', (event, state) => {
                //On download complete
                if (state === 'completed') {
                    //Remove downloaded game from array
                    currentDownloadData.shift();

                    //Remove download snackbar
                    closeSnackbar(`${gameTitle}-download`, false);

                    //Send item download completed
                    ipcRenderer.send('item-download-completed', gameTitle);

                    var extractConfirmSnackbar = {
                        ['main']: [
                            {
                                name: `${gameTitle}-extract-confirm`,
                            },
                        ],
                        ['label']: [
                            {
                                id: `${gameTitle}-snackbar-title`,
                                innerHTML: `Do you want to extract ${zipFile}`,
                            },
                        ],
                        ['actions']: [
                            {
                                type: 'button',
                                innerHTML: 'Yes',
                                labelid: `${gameTitle}-extract-button__label`,
                                class: 'extract-button',
                                id: 'extract-button',
                                onclick: `extractDownload('${fullPath.replace(/\\/g, '/')}', '${path.join(downloadDir, folderName).replace(/\\/g, '/')}', '${gameTitle}')`,
                            },
                            {
                                type: 'button',
                                innerHTML: 'No',
                                labelid: `${gameTitle}-close-button__label`,
                                class: 'close-button',
                                id: 'close-button',
                                onclick: `closeSnackbar('${gameTitle}-extractyn', true, "Are you sure you don't want to extract ${zipFile}")`,
                            },
                        ],
                    };

                    //Add downloaded game to library or install update
                    if (gameTitle == 'vapor-store-update') {
                        installUpdate(zipFile);
                    } else {
                        createSnack(extractConfirmSnackbar);
                        addGameToLibrary(fullPath, path.join(downloadDir, folderName), gameTitle);
                    }

                    //Create notification
                    const notification = {
                        title: `${zipFile} download complete!`,
                        body: 'Return to Vapor Store for further actions',
                        icon: path.join(process.cwd(), 'assets/icons/png/icon.png'),
                    };
                    new Notification(notification).show();

                    //Extract downloaded zip file
                    if (fileType == 'zip') {
                        if (localStorage.getItem('autoExtract') == 'true') {
                            //If auto extract is on skip this step and extract automatically
                            extractDownload(fullPath, path.join(downloadDir, folderName), gameTitle);
                        } else {
                            var extractConfirmData = {
                                fullPath: fullPath,
                                targetFolder: path.join(downloadDir, folderName),
                                gameTitle: gameTitle,
                            };

                            extractNeedsConfirm.push(extractConfirmData);

                            ipcRenderer.send('item-extraction-confirm');
                        }
                    }
                } else {
                    //Download didnt complete
                    console.log(`Download failed: ${state}`);
                }
            });
        },
    });
}
