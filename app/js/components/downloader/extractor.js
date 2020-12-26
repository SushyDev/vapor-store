var currentExtractions = [];

//Extract zip in game file
function extractDownload(targetPath, targetFolder, gameTitle) {
    let folderName = targetFolder.split(path.sep).pop();
    let zipFile = folderName + '.zip';
    let extractDir = targetFolder.replace(folderName, '');

    let indexNum = extractNeedsConfirm.findIndex((key) => key.gameTitle === gameTitle);

    delete extractNeedsConfirm[indexNum];

    extractNeedsConfirm = extractNeedsConfirm.filter((n) => n);

    currentExtractions.push(gameTitle);

    try {
        closeSnackbar(`${gameTitle}-extract-confirm`);
    } catch (e) {}

    let snackbarData = {
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
                onclick: `hideSnackbar('${gameTitle}-extract')`,
                title: 'Hide',
                icon: 'keyboard_arrow_down',
                id: `${gameTitle}-extract-hide`,
            },
        ],
    };

    createSnack(snackbarData);

    (async () => {
        var extracted = 0;
        await extract(targetPath, {
            dir: extractDir,
            onEntry: (entry, zipfile) => {
                extracted++;

                var progress = (extracted * 100) / zipfile.entryCount;
                var scalePercent = progress / 100;

                try {
                    document.getElementById(`${gameTitle}-progress`).style.transform = `scaleX(${scalePercent})`;
                    document.getElementById(`${gameTitle}-snackbar-title`).innerHTML = `Extracting ${zipFile} ${progress.toFixed(2)}%`;
                    ipcRenderer.send('item-extraction-progress', gameTitle, zipFile, progress);
                } catch (e) {}
            },
        });

        fs.unlink(targetPath, (err) => {
            if (err) {
                console.error(err);
            }
        });

        //Function for getting key from game name
        var indexNum = currentExtractions.findIndex((key) => key === gameTitle);
        delete currentExtractions[indexNum];
        currentExtractions = currentExtractions.filter((n) => n);

        closeSnackbar(`${gameTitle}-extract`, false);

        ipcRenderer.send('item-extraction-complete', gameTitle);
    })();
}
