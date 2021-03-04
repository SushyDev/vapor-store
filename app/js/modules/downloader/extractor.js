//Extract zip in game file
exports.extractDownload = async (targetPath, targetFolder, gameTitle) => {
    const folderName = targetFolder.split(path.sep).pop();
    const zipFile = folderName + '.zip';
    const extractDir = targetFolder.replace(folderName, '');

    const indexNum = vapor.fn.getKeyByValue(extractNeedsConfirm, 'gameTitle', gameTitle);

    delete extractNeedsConfirm[indexNum];

    extractNeedsConfirm = extractNeedsConfirm.filter((n) => n);

    currentExtractions.push(gameTitle);

    try {
        vapor.ui.snackbar.close(`${gameTitle}-extract-confirm`);
    } catch (e) {}

    const snackbarData = {
        ['main']: [
            {
                name: `${gameTitle}-extract`,
            },
        ],
        ['progress']: [
            {
                id: `${gameTitle}-progress`,
            },
        ],
        ['label']: [
            {
                id: `${gameTitle}-snackbar-title`,
                innerHTML: `Extracting ${zipFile} 0%`,
            },
        ],
        ['close']: [
            {
                onclick: `vapor.ui.snackbar.close('${gameTitle}-extract')`,
                title: 'Hide',
                icon: 'keyboard_arrow_down',
                id: `${gameTitle}-extract-hide`,
            },
        ],
    };

    vapor.ui.snackbar.create(snackbarData);

    let extracted = 0;
    await extract(targetPath, {
        dir: extractDir,
        onEntry: (entry, zipfile) => {
            extracted++;

            const progress = (extracted * 100) / zipfile.entryCount;
            const scalePercent = progress / 100;

            try {
                document.getElementById(`${gameTitle}-progress`).style.transform = `scaleX(${scalePercent})`;
                document.getElementById(`${gameTitle}-snackbar-title`).innerHTML = `Extracting ${zipFile} ${progress.toFixed(2)}%`;
            } catch (e) {}

            vapor.pages.downloads.itemExtProgress(gameTitle, zipFile, progress);
        },
    });

    fs.unlink(targetPath, (err) => {
        if (err) console.error(err);
    });

    //Function for getting key from game name
    const indexNum2 = currentExtractions.findIndex((key) => key === gameTitle);

    delete currentExtractions[indexNum2];
    currentExtractions = currentExtractions.filter((n) => n);

    vapor.ui.snackbar.close(`${gameTitle}-extract`, false);

    vapor.pages.downloads.itemExtComplete(gameTitle);
};
