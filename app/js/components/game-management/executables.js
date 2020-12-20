//Create list of executables in game folder
function gameListExec(gameTitle, gameFolder, folderName, launchDefault) {
    var subFolder = path.join(gameFolder, folderName);

    if (launchDefault) {
        $.getJSON(file, (data) => {
            data['list'].forEach((game) => {
                if (game.folder == path.resolve(gameFolder)) {
                    if (!!game.default) {
                        gamePlay(path.resolve(game.default));
                    } else {
                        listExec();
                    }
                }
            });
        });
        return;
    }

    function listExec() {
        showProgressBar();

        var name = gameTitle.replace(/ /g, '-').toLowerCase();

        var dialogData = {
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
        createDialog(dialogData, false);

        try {
            getListOfExec(gameFolder).forEach((file) => {
                if (file.substr(file.length - 3) == 'exe') {
                    var executable = path.join(gameFolder, file);

                    var buttonRow = document.createElement('div');
                    buttonRow.classList = 'buttonrow';
                    buttonRow.id = `${executable}-row`;
                    //Create exec button
                    var execButton = document.createElement('button');
                    execButton.className = 'mdc-button mdc-button--raised';
                    execButton.setAttribute('data-mdc-auto-init', 'MDCRipple');
                    execButton.setAttribute('onclick', `gamePlay('${JSON.stringify(executable)}')`);
                    execButton.innerHTML = `<div class="mdc-button__ripple"></div><span class="mdc-button__label">${file.split(path.sep).pop()}</span>`;
                    //Create exec as admin button
                    var execAdminButton = document.createElement('button');
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
                var title = 'No folder found';
                var name = title.replace(/ /g, '-').toLowerCase() + '-alert';
                MDCAlert(title, 'Please manually select the root folder of the game');
                document.querySelector(`#${name}-dialog > div > div > #${name}-dialog__actions > button`).setAttribute('onclick', `closeDialog('${name}'); selectFallbackFolder('${folderName}')`);
            })();
            return;
        }

        openDialog(`${name}-exec`);
        hideProgressBar();
    }
    listExec();
}

function getListOfExec(gameFolder) {
    var list = [];
    list = fs.readdirSync(gameFolder);
    getSubFolders(gameFolder).forEach((subFolder) => {
        var fullSubFolderDir = path.join(gameFolder, subFolder);
        //Open dialog with executable list
        if (subFolder.includes('.exe')) return;
        try {
            list = list.concat(fs.readdirSync(fullSubFolderDir).map((i) => path.join(subFolder, i)));
        }catch(e){}
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
    shell.showItemInFolder(path.join(folder, filename.slice(0, -4)));
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
