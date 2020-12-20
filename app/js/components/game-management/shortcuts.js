//List exe's to create shortcut
function gameShortcut(gameTitle, gameFolder, folderName, launchDefault) {
    var subFolder = path.join(gameFolder, folderName);

    showProgressBar();

    var name = gameTitle.replace(/ /g, '-').toLowerCase();

    var dialogData = {
        ['main']: {
            name: `${name}-shortcut`,
        },
        ['title']: {
            id: `${name}-dialog-title`,
            innerHTML: `Create shortcut`,
        },
        ['actions']: [
            {
                type: 'button',
                icon: 'close',
                class: 'close-button',
                id: `${name}-close-button`,
                onclick: `closeDialog('${name}-shortcut')`,
            },
        ],
    };

    //Create dialog
    createDialog(dialogData, false);

    try {
        getListOfExec(gameFolder).forEach((file) => {
            if (file.substr(file.length - 3) == 'exe') {
                var shortcut = path.join(subFolder, file);
                //Create exec button

                var buttonRow = document.createElement('div');
                buttonRow.classList = 'buttonrow';
                buttonRow.id = `${shortcut}-row`;
                //Create shortcut button
                var shortcutButton = document.createElement('button');
                shortcutButton.className = 'mdc-button mdc-button--raised';
                shortcutButton.setAttribute('data-mdc-auto-init', 'MDCRipple');
                shortcutButton.setAttribute('onclick', `createShortcut('${JSON.stringify(shortcut)}')`);
                shortcutButton.innerHTML = `<div class="mdc-button__ripple"></div><span class="mdc-button__label">${file.split(path.sep).pop()}</span>`;

                //Add button to content
                document.getElementById(`${name}-shortcut-dialog-content`).appendChild(buttonRow);
                document.getElementById(`${shortcut}-row`).appendChild(shortcutButton);
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

    openDialog(`${name}-shortcut`);
    hideProgressBar();
}

function createShortcut(executable) {
    const shortcutsCreated = createDesktopShortcut({
        windows: {filePath: `${executable.replace(/"/g, '')}`},
    });

    shortcutsCreated;
}
