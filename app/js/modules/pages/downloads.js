exports.Initialize = () => {
    const fetchingDownload = downloader.getFetching();
    fetchingDownload.forEach((game) => downloader.item.createFetchingItem(game));

    // ! Fix this later

    // ? Watching download item events

    ipcMain.on('item-fetching-progress', (e, gameTitle, progress) => {
        try {
            const progressBar = document.getElementById(`${gameTitle}-fetch-progress`);
            const mlp = new mdc.linearProgress.MDCLinearProgress(progressBar);
            mlp.progress = progress;
        } catch (e) {}
    });

    ipcMain.on('item-fetching-complete', (event, gameTitle) => downloader.item.removeItem(gameTitle, 'fetch'));

    // ! Fix this later

    ipcMain.on('item-extraction-progress', (e, gameTitle, zipFile, progress) => {
        downloader.item.checkCurrentExtractions();

        const scalePercent = progress / 100;
        try {
            const progressBar = document.getElementById(`${gameTitle}-extraction-progress`);
            const mlp = new mdc.linearProgress.MDCLinearProgress(progressBar);
            mlp.progress = scalePercent;
        } catch (e) {}
    });

    ipcMain.on('item-extraction-complete', (event, gameTitle) => downloader.item.removeItem(gameTitle, 'extraction'));

    ipcMain.on('item-extraction-confirm', () => downloader.item.checkConfirmExtract());
};
