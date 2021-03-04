exports.startDownload = (url, downloadDir, gameTitle) => {
    const {download} = require('electron').remote.require('electron-dl');
    download(win, url, {
        directory: downloadDir,
        allowOverwrite: true,
        onStarted: (item) => {
            if (item.getFilename().endsWith('.html')) {
                item.cancel();
                vapor.ui.dialog.MDCAlert('Download failed', `Please retry<br>Bad item`);
                return;
            }
            if (currentDownloadData.find((game) => game.zipFile == item.getFilename())) return;
            if (currentDownloadData.find((game) => game.gameTitle == gameTitle)) return;

            const itemFilename = item.getFilename();
            const itemSavePath = item.getSavePath();
            const itemDownloadDir = downloadDir;
            const itemFileType = itemFilename.substr(-3);
            const folderName = itemFilename.slice(0, -4);
            const startTime = Date.now();

            const downloadData = {
                gameTitle: gameTitle,
                zipFile: itemFilename,
                fullPath: itemSavePath,
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
                        innerHTML: `Downloading ${itemFilename} 0%`,
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
            ipcRenderer.on(`${gameTitle}-cancel`, () => item.cancel());

            //On incoming data
            item.on('updated', (event, state) => {
                // console.log({event, state, item});

                try {
                    const received_bytes = item.getReceivedBytes();
                    const total_bytes = item.getTotalBytes();

                    const downloadPercent = (received_bytes * 100) / total_bytes;
                    const scalePercent = downloadPercent / 100;

                    const seconds = (Date.now() - startTime) / 1000;
                    const MB = received_bytes / (1024 * 1024);
                    const GB = MB / 1024;
                    const MBps = MB / seconds;
                    const totalGB = total_bytes / (1024 * 1024 * 1024);

                    document.getElementById(`${gameTitle}-download-progress`).style.transform = `scaleX(${scalePercent})`;
                    document.getElementById(`${gameTitle}-snackbar-title`).innerHTML = `Downloading ${itemFilename} ${downloadPercent.toFixed(2)}%`;

                    checkCurrentDownloads();

                    // # Update download page item
                    if (sessionStorage.getItem('page') == 'Downloads') {
                        const downloadInfo = document.getElementById(`${gameTitle}-download-info`);
                        downloadInfo.innerHTML = `${downloadPercent.toFixed(2)}% | ${MBps.toFixed(2)}MB/s | ${GB.toFixed(2)}GB/${totalGB.toFixed(2)}GB`;
                        const progress = document.getElementById(`${gameTitle}-progress`);
                        const mlp = new mdc.linearProgress.MDCLinearProgress(progress);
                        mlp.progress = scalePercent;
                    }
                } catch (e) {
                    console.log('Item mostlikely cancelled');
                    return;
                }
            });

            //On download done
            item.once('done', (event, state) => {
                // # Remove event listener for pause/cancel/resume events
                ipcRenderer.removeAllListeners(`${gameTitle}-pause`);
                ipcRenderer.removeAllListeners(`${gameTitle}-resume`);
                ipcRenderer.removeAllListeners(`${gameTitle}-cancel`);

                // # Remove download snackbar
                vapor.ui.snackbar.close(`${gameTitle}-download`, false);

                // # remove item from currently downloading list
                const indexNum = vapor.fn.getKeyByValue(currentDownloadData, 'gameTitle', gameTitle);

                delete currentDownloadData[indexNum];

                currentDownloadData = currentDownloadData.filter((item) => item);

                //On download complete
                if (state === 'completed') {
                    //Send item download completed
                    downloader.item.removeItem(gameTitle, 'download');

                    //Add downloaded game to library or install update
                    if (gameTitle == 'vapor-store-update') {
                        vapor.app.runExe(path.join(vapor.config.get().downloadDir, itemFilename));
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
                                    innerHTML: `Do you want to extract ${itemFilename}`,
                                },
                            ],
                            ['actions']: [
                                {
                                    type: 'button',
                                    innerHTML: 'Yes',
                                    labelid: `${gameTitle}-extract-button__label`,
                                    class: 'extract-button',
                                    id: 'extract-button',
                                    onclick: `downloader.extractDownload('${itemSavePath.replace(/\\/g, '/')}', '${path.join(itemDownloadDir, folderName).replace(/\\/g, '/')}', '${gameTitle}')`,
                                },
                                {
                                    type: 'button',
                                    innerHTML: 'No',
                                    labelid: `${gameTitle}-close-button__label`,
                                    class: 'close-button',
                                    id: 'close-button',
                                    onclick: `vaporSnackbar.close('${gameTitle}-extractyn', true, "Are you sure you don't want to extract ${itemFilename}")`,
                                },
                            ],
                        };
                        vapor.ui.snackbar.create(extractConfirmSnackbar);
                        downloader.addGameToLibrary(itemSavePath, path.join(itemDownloadDir, folderName), gameTitle);
                    }

                    //Create notification
                    const notifData = {
                        title: `${itemFilename} download complete!`,
                        body: 'Return to Vapor Store for further actions',
                        icon: vapor.fn.vaporIcon(),
                    };
                    new Notification(notifData).show();

                    // ? Extract downloaded zip file
                    if (itemFileType == 'zip') {
                        if (vapor.config.get().autoExtract) {
                            // ? If auto extract is on skip this step and extract automatically
                            downloader.extractDownload(itemSavePath, path.join(itemDownloadDir, folderName), gameTitle);
                        } else {
                            const extractConfirmData = {
                                fullPath: itemSavePath,
                                targetFolder: path.join(itemDownloadDir, folderName),
                                gameTitle: gameTitle,
                            };

                            extractNeedsConfirm.push(extractConfirmData);

                            ipcRenderer.send('item-extraction-confirm');
                        }
                    }
                } else if (state === 'cancelled') {
                    vapor.ui.dialog.MDCAlert('Download cancelled', `Download for ${gameTitle} is cancelled`);
                } else {
                    //Create notification
                    const notifData = {
                        title: `${itemFilename} download failed!`,
                        body: 'Return to Vapor Store for further actions',
                        icon: vapor.fn.vaporIcon(),
                    };
                    new Notification(notifData).show();
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
