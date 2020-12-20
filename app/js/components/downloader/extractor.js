//Extract zip in game file
function extractDownload(targetPath, targetFolder, gameTitle) {
    var folderName = targetFolder.split('/').pop();
    var zipFile = folderName + '.zip';
    var extractDir = targetFolder.replace(folderName, '');

    console.log('targetPath', targetPath)
    console.log('folderName', folderName);
    console.log('zipFile', zipFile);
    console.log('extractDir', extractDir);

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
                } catch (e) {}
            },
        });

        fs.unlink(targetPath, (err) => {
            if (err) {
                console.error(err);
            }
        });

        document.getElementById(`${gameTitle}-extract-snack-actions`).style.display = 'none';
        showSnackbar(`${gameTitle}-extract`);
        document.getElementById(`${gameTitle}-snackbar-title`).innerHTML = `Extracted ${zipFile}`;

        //Close snackbar after 2.5 sec
        setTimeout(() => {
            closeSnackbar(`${gameTitle}-extract`, false);
        }, 5000);
    })();
}
