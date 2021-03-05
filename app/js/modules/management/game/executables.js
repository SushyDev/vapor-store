// ? Create list of executables in game folder
exports.listGameExec = async (gameID, gameDir) => {
    vapor.ui.showProgressBar();

    const name = gameID.replace(/ /g, '-').toLowerCase();

    const executablesDialog = {
        ['main']: [
            {
                name: `Executables`,
                id: `${name}-exec`,
            },
        ],
        ['actions']: [
            {
                name: `Close`,
                action: `vapor.ui.dialog.close('${name}-exec')`,
            },
        ],
    };

    // ? Create dialog
    vapor.ui.dialog.create(executablesDialog, false);

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
        execButton.setAttribute('onclick', `manage.game.gamePlay('${JSON.stringify(exec.path)}')`);
        execButton.innerHTML = `<div class="mdc-button__ripple"></div><span class="mdc-button__label">${exec.name.split(path.sep).pop().replace(/_/g, ' ')}</span>`;
        // ? Create exec as admin button
        const execAdminButton = document.createElement('button');
        execAdminButton.className = 'mdc-button mdc-button--raised row-icon';
        execAdminButton.setAttribute('data-mdc-auto-init', 'MDCRipple');
        execAdminButton.setAttribute('onclick', `manage.game.gamePlay('${JSON.stringify(exec.path)}', true)`);
        execAdminButton.innerHTML = `<div class="mdc-button__ripple"></div><i class="material-icons mdc-button__icon" aria-hidden="true">admin_panel_settings</i>`;

        // ? Add button to content
        document.getElementById(`${executablesDialog.main[0].id}-dialog-content`).appendChild(buttonRow);
        document.getElementById(`${exec.path}-row`).appendChild(execAdminButton);
        document.getElementById(`${exec.path}-row`).appendChild(execButton);
        window.mdc.autoInit();
    });

    vapor.ui.dialog.open(executablesDialog.main[0].id);
    vapor.ui.hideProgressBar();

    // # Check if game has default, implement this later
};

// ? Launch the executable
exports.gamePlay = (executable, admin) => {
    if (isDev) console.log(executable);
    const exec = require('child_process').exec;

    admin ? exec(`start "" "${executable.replace(/"/g, '')}"`, (err, data) => console.log(err)) : exec(`powershell -command "start-process \\"${executable.replace(/"/g, '')}\\" -verb runas`, (err, data) => console.log(err));
};
