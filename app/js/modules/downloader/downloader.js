exports.startDownload = (url, gameID) => {
    const {download} = require('electron').remote.require('electron-dl');
    const itemDownloadDir = vapor.config.get().downloadDir;
    download(win, url, {
        directory: itemDownloadDir,
        allowOverwrite: true,
        onStarted: (item) => {
            if (!(item.getFilename().endsWith('.exe') || item.getFilename().endsWith('.zip') || item.getFilename().endsWith('.rar'))) {
                item.cancel();
                vapor.ui.dialog.MDCAlert('Download failed', `Please retry<br>Bad item`);
                return;
            }
            if (currentDownloadData.find((game) => game.zipFile == item.getFilename())) return;
            if (currentDownloadData.find((game) => game.gameID == gameID)) return;

            const itemFilename = item.getFilename();
            const itemSavePath = item.getSavePath();
            const itemFileType = itemFilename.substr(-3);
            const folderName = itemFilename.slice(0, -4);
            const startTime = Date.now();

            currentDownloadData.push({
                gameID: gameID,
                zipFile: itemFilename,
                fullPath: itemSavePath,
                url: url,
            });

            // # Create event handlers
            ipcRenderer.on(`${gameID}-pause`, () => item.pause());
            ipcRenderer.on(`${gameID}-resume`, () => item.resume());
            ipcRenderer.on(`${gameID}-cancel`, () => item.cancel());

            // # On incoming data
            item.on('updated', () => {
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

                    checkCurrentDownloads();

                    // # Update download page item
                    if (sessionStorage.getItem('page') == 'Downloads') {
                        const downloadInfo = document.getElementById(`${gameID}-download-info`);
                        downloadInfo.innerHTML = `${downloadPercent.toFixed(2)}% | ${MBps.toFixed(2)}MB/s | ${GB.toFixed(2)}GB/${totalGB.toFixed(2)}GB`;
                        const progress = document.getElementById(`${gameID}-progress`);
                        const mlp = new mdc.linearProgress.MDCLinearProgress(progress);
                        mlp.progress = scalePercent;
                    }
                } catch (e) {
                    console.log('Err', e);
                    console.log('Item mostlikely cancelled');
                    return;
                }
            });

            // # On download done
            item.once('done', (event, state) => {
                // # Remove event listener for pause/cancel/resume events
                ipcRenderer.removeAllListeners(`${gameID}-pause`);
                ipcRenderer.removeAllListeners(`${gameID}-resume`);
                ipcRenderer.removeAllListeners(`${gameID}-cancel`);

                // ? remove item from currently downloading list
                const indexNum = vapor.fn.getKeyByValue(currentDownloadData, 'gameID', gameID);
                delete currentDownloadData[indexNum];
                currentDownloadData = currentDownloadData.filter((item) => item);

                // ? Create notification
                const notifData = {
                    title: `${itemFilename} download ${state}!`,
                    body: 'Return to Vapor Store for further actions',
                    icon: vapor.fn.vaporIcon(),
                };
                new Notification(notifData).show();

                // ? Remove download item from downloads page
                downloader.item.removeItem(gameID, 'download');

                // # On download complete
                if (state === 'completed') {
                    // ? Add downloaded game to library or install update
                    if (gameID == 'vapor-store-update') vapor.app.runExe(path.join(vapor.config.get().downloadDir, itemFilename));

                    // ? Extract downloaded zip file
                    if (itemFileType == 'zip') {
                        if (vapor.config.get().autoExtract) {
                            // ? If auto extract is on skip this step and extract automatically
                            downloader.extractDownload(itemSavePath, path.join(itemDownloadDir, folderName), gameID);
                        } else {
                            extractNeedsConfirm.push({
                                fullPath: itemSavePath,
                                targetFolder: path.join(itemDownloadDir, folderName),
                                gameID: gameID,
                            });

                            // ? Create snackbar
                            vapor.ui.snackbar.create({
                                ['main']: [
                                    {
                                        name: `${gameID}-needs-extraction`,
                                    },
                                ],
                                ['label']: [
                                    {
                                        id: `started-snackbar-title`,
                                        innerHTML: `${itemFilename} needs confirmation to be extracted`,
                                    },
                                ],
                            });

                            downloader.item.checkConfirmExtract();
                        }
                    }
                } else if (state === 'cancelled') {
                    vapor.ui.dialog.MDCAlert('Download cancelled', `Download for ${gameID} is cancelled`);
                }
            });
        },
    });
};

function checkCurrentDownloads() {
    currentDownloadData.forEach((game) => {
        if (!document.getElementById(`${game.gameID}-download-item`) && sessionStorage.getItem('page') == 'Downloads') downloader.item.createDownloadItem(game);
    });
}
