// ? List exe's to create shortcut
exports.gameShortcut = async (gameID, gameDir) => {
    vapor.ui.showProgressBar();

    const name = gameID.replace(/ /g, '-').toLowerCase();

    const shortcutDialog = {
        ['main']: [
            {
                name: `Create a shortcut`,
                id: `${name}-shortcut`,
            },
        ],
        ['actions']: [
            {
                name: `Close`,
                action: `vapor.ui.dialog.close('${name}-shortcut')`,
            },
        ],
    };

    // ? Create dialog
    vapor.ui.dialog.create(shortcutDialog, false);

    const executables = await manage.game.getFiles(gameDir);

    executables.forEach((exec) => {
        // ? Create button row
        const buttonRow = document.createElement('div');
        buttonRow.classList = 'buttonrow';
        buttonRow.id = `${exec.path}-row`;
        // ? Create exec button
        const execButton = document.createElement('button');
        execButton.className = 'mdc-button mdc-button--raised';
        execButton.setAttribute('data-mdc-auto-init', 'MDCRipple');
        execButton.setAttribute('onclick', `manage.game.createShortcut('${JSON.stringify(exec.path)}')`);
        execButton.innerHTML = `<div class="mdc-button__ripple"></div><span class="mdc-button__label">${exec.name.split(path.sep).pop().replace(/_/g, ' ')}</span>`;

        // ? Add button to content
        document.getElementById(`${shortcutDialog.main[0].id}-dialog-content`).appendChild(buttonRow);
        document.getElementById(`${exec.path}-row`).appendChild(execButton);
        window.mdc.autoInit();
    });

    vapor.ui.dialog.open(shortcutDialog.main[0].id);
    vapor.ui.hideProgressBar();
};
