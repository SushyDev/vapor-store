exports.startDownload = (url, dir, gameTitle) => {
    const {download} = require('electron').remote.require('electron-dl');
    download(win, url, {
        directory: dir,
        allowOverwrite: true,
        onStarted: (item) => {
            if (currentDownloadName.includes(gameTitle)) return;
            currentDownloadName.push(gameTitle);

            const downloadDir = localStorage.getItem('downloadDir');
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

            //Remove starting snackbar
            if (!gameTitle.includes('vapor-store-update')) vapor.ui.snackbar.close(`${gameTitle}-fetching`, false);

            //Create snackbar
            vapor.ui.snackbar.create(snackbarData);

            ipcRenderer.on(`${gameTitle}-pause`, () => item.pause());

            ipcRenderer.on(`${gameTitle}-resume`, () => item.resume());

            ipcRenderer.on(`${gameTitle}-cancel`, () => {
                item.cancel();

                // # remove item from currently downloading list
                const indexNum = currentDownloadData.findIndex((key) => key.gameTitle === gameTitle);

                delete currentDownloadData[indexNum];

                currentDownloadData = currentDownloadData.filter((n) => n);

                return;
            });

            //On incoming data
            item.on('updated', (event, state) => {
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
                } catch (e) {
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
                                onclick: `extractDownload('${fullPath.replace(/\\/g, '/')}', '${path.join(downloadDir, folderName).replace(/\\/g, '/')}', '${gameTitle}')`,
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

                    //Add downloaded game to library or install update
                    if (gameTitle == 'vapor-store-update') {
                        vapor.app.installUpdate(itemName);
                    } else {
                        vapor.ui.snackbar.create(extractConfirmSnackbar);
                        downloader.addGameToLibrary(fullPath, path.join(downloadDir, folderName), gameTitle);
                    }

                    //Create notification
                    const notification = {
                        title: `${itemName} download complete!`,
                        body: 'Return to Vapor Store for further actions',
                        icon: path.join(process.cwd(), 'assets/icons/png/icon.png'),
                    };
                    new Notification(notification).show();

                    //Extract downloaded zip file
                    if (fileType == 'zip') {
                        if (localStorage.getItem('autoExtract') == 'true') {
                            //If auto extract is on skip this step and extract automatically
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
                    //Download didnt complete
                    console.log(`Download failed: ${state}`);
                }
            });
        },
    });
};

const checkCurrentDownloads = () => {
    currentDownloadData.forEach((game) => {
        if (!document.getElementById(`${game.gameTitle}-download-item`) && sessionStorage.getItem('page') == 'Downloads') downloader.item.createDownloadItem(game);
    });
};

// ! Fix this later
ipcMain.on('item-updated-data', (e, item, data, gameTitle) => {
    checkCurrentDownloads();

    const received_bytes = item.received;
    const total_bytes = item.total;
    const downloadPercent = (received_bytes * 100) / total_bytes;
    const scalePercent = downloadPercent / 100;

    //received / 1000000 / time;

    const seconds = (Date.now() - item.startTime) / 1000;
    const MB = received_bytes / (1024 * 1024);
    const GB = MB / 1024;
    const MBps = MB / seconds;
    const totalGB = total_bytes / (1024 * 1024 * 1024);

    try {
        const downloadInfo = document.getElementById(`${gameTitle}-download-info`);
        downloadInfo.innerHTML = `${downloadPercent.toFixed(2)}% | ${MBps.toFixed(2)}MB/s | ${GB.toFixed(2)}GB/${totalGB.toFixed(2)}GB`;
        const progress = document.getElementById(`${gameTitle}-progress`);
        const mlp = new mdc.linearProgress.MDCLinearProgress(progress);
        mlp.progress = scalePercent;
    } catch (e) {}
});

ipcMain.on('item-download-completed', (e, gameTitle) => downloader.item.removeItem(gameTitle, 'download'));
