var currentExtractions = [];

//Extract zip in game file
function extractDownload(targetPath, targetFolder, gameTitle) {
    var folderName = targetFolder.split(path.sep).pop();
    var zipFile = folderName + '.zip';
    var extractDir = targetFolder.replace(folderName, '');

    currentExtractions.push(gameTitle);

    try {
        closeSnackbar(`${gameTitle}-extractyn`, false);
    } catch (e) {}

    var snackbarData = {
        ['main']: [
            {
                name: `${gameTitle}-extract`,
            },
        ],
        ['progress']: [
            {
                enabled: true,
                id: `${gameTitle}-progress`,
            },
        ],
        ['label']: [
            {
                id: `${gameTitle}-snackbar-title`,
                innerHTML: `Extracting ${zipFile} 0%`,
            },
        ],
        ['actions']: [],
        ['close']: [
            {
                enabled: true,
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

        document.getElementById(`${gameTitle}-extract-snack-actions`).style.display = 'none';
        showSnackbar(`${gameTitle}-extract`);
        document.getElementById(`${gameTitle}-snackbar-title`).innerHTML = `Extracted ${zipFile}`;

        ipcRenderer.send('item-extraction-complete', gameTitle);

        //Close snackbar after 2.5 sec
        setTimeout(() => {
            closeSnackbar(`${gameTitle}-extract`, false);
        }, 5000);
    })();
}
