//Extract zip in game file
exports.extractDownload = async (targetPath, targetFolder, gameID) => {
    const folderName = targetFolder.split(path.sep).pop();
    const zipFile = folderName + '.zip';
    const extractDir = targetFolder.replace(folderName, '');

    const indexNum = vapor.fn.getKeyByValue(extractNeedsConfirm, 'gameID', gameID);

    delete extractNeedsConfirm[indexNum];

    extractNeedsConfirm = extractNeedsConfirm.filter((n) => n);

    currentExtractions.push(gameID);


    let extracted = 0;
    await extract(targetPath, {
        dir: extractDir,
        onEntry: (entry, zipfile) => {
            extracted++;

            const progress = (extracted * 100) / zipfile.entryCount;

            page.downloads.itemExtProgress(gameID, zipFile, progress);
        },
    });

    fs.unlink(targetPath, (err) => {
        if (err) console.error(err);
    });

    //Function for getting key from game name
    const indexNum2 = currentExtractions.findIndex((key) => key === gameID);

    delete currentExtractions[indexNum2];
    currentExtractions = currentExtractions.filter((n) => n);

    // ? On complete remove download item from downloads page
    downloader.item.removeItem(gameID, 'extraction');

    // ? Add game to installed list
    downloader.addGameToLibrary(targetFolder, gameID);
};
