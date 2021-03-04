exports.Initialize = () => {
    const fetchingDownload = downloader.getFetching();
    fetchingDownload.forEach((game) => downloader.item.createFetchingItem(game));
};

// ? Watching download item events

// ? On item extraction progresss
exports.itemExtProgress = (gameTitle, zipFile, progress) => {
    downloader.item.checkCurrentExtractions();

    const scalePercent = progress / 100;
    try {
        const progressBar = document.getElementById(`${gameTitle}-extraction-progress`);
        const mlp = new mdc.linearProgress.MDCLinearProgress(progressBar);
        mlp.progress = scalePercent;
    } catch (e) {}
};

// ? On extraction done
exports.itemExtComplete = (gameTitle) => downloader.item.removeItem(gameTitle, 'extraction');

// ? When requires user confirmation to extract game
// ? Maybe later add game specific confirm? idk how this works anymore
exports.itemExtConfirm = () => downloader.item.checkConfirmExtract();

// ? On item fetching progress
exports.itemFetchProgress = (gameTitle, progress) => {
    try {
        const progressBar = document.getElementById(`${gameTitle}-fetch-progress`);
        const mlp = new mdc.linearProgress.MDCLinearProgress(progressBar);
        mlp.progress = progress;
    } catch (e) {}
};

// ? On item fetching done
exports.itemFetchingComplete = (gameTitle) => downloader.item.removeItem(gameTitle, 'fetch');
