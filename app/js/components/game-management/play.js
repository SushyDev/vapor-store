function gamePlay(executable) {
    console.log(executable)
    var exec = require('child_process').exec;
    exec(`start "" "${executable.replace(/"/g, '')}"`, (err, data) => {
        console.log(err);
    });
}

function gamePlayAdmin(executable) {
    exec(`powershell -command "start-process \\"${executable.replace(/"/g, '')}\\" -verb runas`, (err, data) => {
        console.log(err);
    });
}

//Select default
function selectDefault(gameTitle, gameFolder, folderName, launchDefault) {
    var subFolder = path.join(gameFolder, folderName);
    showProgressBar();

    var name = gameTitle.replace(/ /g, '-').toLowerCase();

    var dialogData = {
        ['main']: {
            name: `${name}-default`,
        },
        ['title']: {
            id: `${name}-dialog-title`,
            innerHTML: `Select default exe`,
        },
        ['actions']: [
            {
                type: 'button',
                icon: 'close',
                class: 'close-button',
                id: `${name}-close-button`,
                onclick: `closeDialog('${name}-default')`,
            },
        ],
    };

    //Create dialog
    createDialog(dialogData, false);

    try {
        getListOfExec(gameFolder).forEach((file) => {
            if (file.substr(file.length - 3) == 'exe') {
                var shortcut = path.join(gameFolder, file);
                //Create exec button

                var buttonRow = document.createElement('div');
                buttonRow.classList = 'buttonrow';
                buttonRow.id = `${shortcut}-row`;
                //Create shortcut button
                var defaultButton = document.createElement('button');
                defaultButton.className = 'mdc-button mdc-button--raised';
                defaultButton.setAttribute('data-mdc-auto-init', 'MDCRipple');
                defaultButton.setAttribute('onclick', `setDefault('${gameTitle}', '${JSON.stringify(shortcut)}')`);
                defaultButton.innerHTML = `<div class="mdc-button__ripple"></div><span class="mdc-button__label">${file.split(path.sep).pop()}</span>`;

                //Add button to content
                document.getElementById(`${name}-default-dialog-content`).appendChild(buttonRow);
                document.getElementById(`${shortcut}-row`).appendChild(defaultButton);
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

    openDialog(`${name}-default`);
    hideProgressBar();
}

function setDefault(gameTitle, exec) {
    $.getJSON(file, (data) => {
        data['list'].forEach((game) => {
            var indexNum = data['list'].findIndex((game) => game.name == gameTitle);

            if (game.name == gameTitle) {
                data['list'][indexNum] = {
                    ...game,
                    default: exec.replace(/"/g, ''),
                };
            }
        });

        fs.writeFile(file, JSON.stringify(data), function (err) {
            if (err) throw err;
            if (isDev) console.log('Saved!');
        });
    });
}
