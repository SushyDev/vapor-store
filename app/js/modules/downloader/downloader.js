exports.startDownload = (url, dir, gameTitle) => {
    const {download} = require('electron').remote.require('electron-dl');
    download(win, url, {
        directory: dir,
        allowOverwrite: true,
        onStarted: (item) => {
            if (currentDownloadName.includes(gameTitle)) return;
            currentDownloadName.push(gameTitle);

            const downloadDir = vapor.config.get().downloadDir;
            const itemName = item.getFilename();
            const fullPath = path.join(downloadDir, itemName);
            const folderName = itemName.slice(0, -4);
            const fileType = itemName.substr(-3);
            const startTime = Date.now();

            const downloadData = {
                gameTitle: gameTitle,
                zipFile: itemName,
                fullPath: fullPath,
                url: url,
            };

            currentDownloadData.push(downloadData);

            const snackbarData = {
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
                        innerHTML: `Downloading ${itemName} 0%`,
                    },
                ],
                ['close']: [
                    {
                        onclick: `vapor.ui.snackbar.hide('${gameTitle}-download')`,
                        title: 'Hide',
                        icon: 'keyboard_arrow_down',
                        id: `${gameTitle}-hide`,
                    },
                ],
            };

            //Create snackbar
            vapor.ui.snackbar.create(snackbarData);

            ipcRenderer.on(`${gameTitle}-pause`, () => item.pause());

            ipcRenderer.on(`${gameTitle}-resume`, () => item.resume());

            ipcRenderer.on(`${gameTitle}-cancel`, () => {
                item.cancel();

                // # remove item from currently downloading list
                const indexNum = vapor.fn.getKeyByValue(currentDownloadData, 'gameTitle', gameTitle);

                delete currentDownloadData[indexNum];

                currentDownloadData = currentDownloadData.filter((item) => item);

                return;
            });

            //On incoming data
            item.on('updated', (event, state) => {
                if (item.isDestroyed() || item.isDestroyed() == undefined) return;
                try {
                    //Downloading
                    const received_bytes = item.getReceivedBytes();
                    const total_bytes = item.getTotalBytes();

                    const downloadPercent = (received_bytes * 100) / total_bytes;
                    const scalePercent = downloadPercent / 100;

                    document.getElementById(`${gameTitle}-download-progress`).style.transform = `scaleX(${scalePercent})`;
                    document.getElementById(`${gameTitle}-snackbar-title`).innerHTML = `Downloading ${itemName} ${downloadPercent.toFixed(2)}%`;

                    // ? Send item data to downloader
                    ipcRenderer.send('item-updated-data', {received: received_bytes, total: total_bytes, startTime: startTime}, downloadData, gameTitle);
                } catch (err) {
                    console.log('item-updated', err);
                    // ! Can error on download finish so it catches here
                }
            });

            //On download done
            item.once('done', (event, state) => {
                //On download complete
                if (state === 'completed') {
                    //Remove downloaded game from array
                    currentDownloadData.shift();

                    //Remove download snackbar
                    vapor.ui.snackbar.close(`${gameTitle}-download`, false);

                    //Send item download completed
                    ipcRenderer.send('item-download-completed', gameTitle);

                    //Add downloaded game to library or install update
                    if (gameTitle == 'vapor-store-update') {
                        vapor.app.runExe(path.join(localStorage.getItem('downloadDir'), itemName));
                    } else {
                        const extractConfirmSnackbar = {
                            ['main']: [
                                {
                                    name: `${gameTitle}-extract-confirm`,
                                },
                            ],
                            ['label']: [
                                {
                                    id: `${gameTitle}-snackbar-title`,
                                    innerHTML: `Do you want to extract ${itemName}`,
                                },
                            ],
                            ['actions']: [
                                {
                                    type: 'button',
                                    innerHTML: 'Yes',
                                    labelid: `${gameTitle}-extract-button__label`,
                                    class: 'extract-button',
                                    id: 'extract-button',
                                    onclick: `downloader.extractDownload('${fullPath.replace(/\\/g, '/')}', '${path.join(downloadDir, folderName).replace(/\\/g, '/')}', '${gameTitle}')`,
                                },
                                {
                                    type: 'button',
                                    innerHTML: 'No',
                                    labelid: `${gameTitle}-close-button__label`,
                                    class: 'close-button',
                                    id: 'close-button',
                                    onclick: `vaporSnackbar.close('${gameTitle}-extractyn', true, "Are you sure you don't want to extract ${itemName}")`,
                                },
                            ],
                        };
                        vapor.ui.snackbar.create(extractConfirmSnackbar);
                        downloader.addGameToLibrary(fullPath, path.join(downloadDir, folderName), gameTitle);
                    }

                    //Create notification
                    const notifData = {
                        title: `${itemName} download complete!`,
                        body: 'Return to Vapor Store for further actions',
                        icon: vapor.fn.vaporIcon(),
                    };
                    new Notification(notifData).show();

                    // ? Extract downloaded zip file
                    if (fileType == 'zip') {
                        if (vapor.config.get().autoExtract) {
                            // ? If auto extract is on skip this step and extract automatically
                            downloader.extractDownload(fullPath, path.join(downloadDir, folderName), gameTitle);
                        } else {
                            const extractConfirmData = {
                                fullPath: fullPath,
                                targetFolder: path.join(downloadDir, folderName),
                                gameTitle: gameTitle,
                            };

                            extractNeedsConfirm.push(extractConfirmData);

                            ipcRenderer.send('item-extraction-confirm');
                        }
                    }
                } else {
                    // ? Download didnt complete
                    console.log(`Download failed: ${state}`);
                }
            });
        },
    });
};

function checkCurrentDownloads() {
    currentDownloadData.forEach((game) => {
        if (!document.getElementById(`${game.gameTitle}-download-item`) && sessionStorage.getItem('page') == 'Downloads') downloader.item.createDownloadItem(game);
    });
}

ipcMain.on('item-updated-data', (event, item, data, gameTitle) => {
    checkCurrentDownloads();

    const received_bytes = item.received;
    const total_bytes = item.total;
    const downloadPercent = (received_bytes * 100) / total_bytes;
    const scalePercent = downloadPercent / 100;

    const seconds = (Date.now() - item.startTime) / 1000;
    const MB = received_bytes / (1024 * 1024);
    const GB = MB / 1024;
    const MBps = MB / seconds;
    const totalGB = total_bytes / (1024 * 1024 * 1024);

    // # Update download page item
    if (sessionStorage.getItem('page') == 'Downloads') {
        const downloadInfo = document.getElementById(`${gameTitle}-download-info`);
        downloadInfo.innerHTML = `${downloadPercent.toFixed(2)}% | ${MBps.toFixed(2)}MB/s | ${GB.toFixed(2)}GB/${totalGB.toFixed(2)}GB`;
        const progress = document.getElementById(`${gameTitle}-progress`);
        const mlp = new mdc.linearProgress.MDCLinearProgress(progress);
        mlp.progress = scalePercent;
    }
});

ipcMain.on('item-download-completed', (event, gameTitle) => downloader.item.removeItem(gameTitle, 'download'));
