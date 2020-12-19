//Extract zip in game file
function extractDownload(targetPath, targetFolder, filename, gameTitle) {
    var name = filename.slice(0, -4);

    closeSnackbar(`${name}-extractyn`, false);

    var snackbarData = {
        ['main']: [
            {
                name: `${name}-extract`,
            },
        ],
        ['progress']: [
            {
                enabled: true,
                id: `${name}-progress`,
            },
        ],
        ['label']: [
            {
                id: `${name}-snackbar-title`,
                innerHTML: `Extracting ${filename} 0%`,
            },
        ],
        ['actions']: [],
        ['close']: [
            {
                enabled: true,
                onclick: `closeSnackbar('${name}-extract', false)`,
                title: 'Hide',
                icon: 'keyboard_arrow_down',
                id: `${name}-extract-hide`,
            },
        ],
    };

    createSnack(snackbarData);

    (async () => {
        try {
            var extracted = 0;
            await extract(targetPath, {
                dir: targetFolder,
                onEntry: (entry, zipfile) => {
                    extracted++;

                    var progress = (extracted * 100) / zipfile.entryCount;
                    var scalePercent = progress / 100;

                    document.getElementById(`${name}-progress`).style.transform = `scaleX(${scalePercent})`;
                    document.getElementById(`${name}-snackbar-title`).innerHTML = `Extracting ${filename} ${progress.toFixed(2)}%`;
                },
            });

            fs.unlink(targetPath, (err) => {
                if (err) {
                    console.error(err);
                }
            });

            document.getElementById(`${name}-extract-snack-actions`).style.display = 'none';
            document.getElementById(`${name}-snackbar-title`).innerHTML = `Extracted ${filename}`;

            //Close snackbar after 2.5 sec
            setTimeout(() => {
                closeSnackbar(`${name}-extract`, false);
            }, 2500);
        } catch (err) {
            console.log(err);
        }
    })();
}
