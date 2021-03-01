//Create list of executables in game folder
exports.listGameExec = (gameTitle, gameFolder, folderName, launchDefault) => {
    // ! Remove this? => const subFolder = path.join(gameFolder, folderName);

    if (launchDefault) {
        $.getJSON(file, (data) => {
            data['list'].forEach((game) => {
                if (isDev) console.log(game.folder);
                if (game.folder == folderName) !!game.default ? gamePlay(path.resolve(game.default)) : listExec();
            });
        });
        // ! Remove this? => return;
    }
};

exports.listExec = () => {
    vapor.ui.interface.showProgressBar();

    const name = gameTitle.replace(/ /g, '-').toLowerCase();

    const dialogData = {
        ['main']: {
            name: `${name}-exec`,
        },
        ['title']: {
            id: `${name}-dialog-title`,
            innerHTML: `Executables`,
        },
        ['actions']: [
            {
                type: 'button',
                icon: 'close',
                class: 'close-button',
                id: `${name}-close-button`,
                onclick: `closeDialog('${name}-exec')`,
            },
        ],
    };

    //Create dialog
    vapor.ui.dialog.create(dialogData, false);
    const file = vapor.fn.installedGames();
    try {
        getListOfExec(gameFolder).forEach((file) => {
            if (file.substr(file.length - 3) == 'exe') {
                const executable = path.join(gameFolder, file);

                const buttonRow = document.createElement('div');
                buttonRow.classList = 'buttonrow';
                buttonRow.id = `${executable}-row`;
                //Create exec button
                const execButton = document.createElement('button');
                execButton.className = 'mdc-button mdc-button--raised';
                execButton.setAttribute('data-mdc-auto-init', 'MDCRipple');
                execButton.setAttribute('onclick', `gamePlay('${JSON.stringify(executable)}')`);
                execButton.innerHTML = `<div class="mdc-button__ripple"></div><span class="mdc-button__label">${file.split(path.sep).pop()}</span>`;
                //Create exec as admin button
                const execAdminButton = document.createElement('button');
                execAdminButton.className = 'mdc-button mdc-button--raised row-icon';
                execAdminButton.setAttribute('data-mdc-auto-init', 'MDCRipple');
                execAdminButton.setAttribute('onclick', `gamePlayAdmin('${JSON.stringify(executable)}')`);
                execAdminButton.innerHTML = `<div class="mdc-button__ripple"></div><i class="material-icons mdc-button__icon" aria-hidden="true">admin_panel_settings</i>`;

                //Add button to content
                document.getElementById(`${name}-exec-dialog-content`).appendChild(buttonRow);
                document.getElementById(`${executable}-row`).appendChild(execAdminButton);
                document.getElementById(`${executable}-row`).appendChild(execButton);
                window.mdc.autoInit();
            }
        });
    } catch (e) {
        (async () => {
            const title = 'No folder found';
            const name = title.replace(/ /g, '-').toLowerCase() + '-alert';
            MDCAlert(title, 'Please manually select the root folder of the game');
            document.querySelector(`#${name}-dialog > div > div > #${name}-dialog__actions > button`).setAttribute('onclick', `closeDialog('${name}'); selectFallbackFolder('${folderName}')`);
        })();
        return;
    }

    vapor.ui.dialog.open(`${name}-exec`);
    vapor.ui.interface.hideProgressBar();
};

function getListOfExec(gameFolder) {
    let list = [];
    list = fs.readdirSync(gameFolder);
    getSubFolders(gameFolder).forEach((subFolder) => {
        const fullSubFolderDir = path.join(gameFolder, subFolder);
        //Open dialog with executable list
        if (subFolder.includes('.exe')) return;
        try {
            list = list.concat(fs.readdirSync(fullSubFolderDir).map((i) => path.join(subFolder, i)));
        } catch (e) {}
    });
    return list;
}

//If subfolder return subfolder name
function getSubFolders(dir) {
    return fs.readdirSync(dir).filter(function (subfolder) {
        return fs.statSync(path.join(dir, subfolder));
    });
}

function openFolder(folder, filename) {
    shell.showItemInFolder(path.join(folder));
}

//If no folder was found
function selectFallbackFolder(fileName) {
    // console.log(fileName);

    $.getJSON(file, (data) => {
        data['list'].forEach((game) => {
            if (game.fileName == fileName) {
                // console.log(game);
            }
        });
    });
}
