function addInstalledGame() {
    var name = 'add-game';
    var fileName = 'test';
    var dialogData = {
        ['main']: {
            name: `${name}`,
        },
        ['title']: {
            id: `${name}-dialog-title`,
            innerHTML: `Add Game`,
        },
        ['contents']: [
            {
                type: 'div',
                innerHTML: `
<label class="mdc-text-field mdc-text-field--filled" data-mdc-auto-init="MDCTextField">
  <span class="mdc-text-field__ripple"></span>
  <span class="mdc-floating-label">Name</span>
  <input class="mdc-text-field__input" type="text" id="game-name-value">
  <span class="mdc-line-ripple"></span>
</label>

`,
                class: 'game-name',
                id: 'game-name',
            },
            {
                type: 'div',
                innerHTML: `
<button class="mdc-button mdc-button--raised" onclick="selectGameFolder()">
  <div class="mdc-button__ripple"></div>
  <i class="material-icons mdc-button__icon" aria-hidden="true"
    >folder</i
  >
  <span class="mdc-button__label">Select folder</span>
</button>
`,
                class: 'game-directory',
                id: 'game-directory',
            },
            {
                type: 'div',
                innerHTML: `<p id="game-directory-text-value"></p>`,
                class: 'game-directory-text',
                id: 'game-directory-text',
            },
        ],
        ['actions']: [
            {
                type: 'button',
                icon: 'close',
                class: 'close-button',
                id: `${name}-close-button`,
                onclick: `closeDialog('${name}')`,
            },
            {
                type: 'button',
                icon: 'check',
                class: 'create-button',
                id: `${name}-create-button`,
                onclick: `createCustomGame('${name}')`,
            },
        ],
    };

    createDialog(dialogData);
}

function selectGameFolder() {
    var options = {
        title: 'Select Folder',
        properties: ['openDirectory'],
    };
    dialog.showOpenDialog(null, options).then(async (folder) => {
        sessionStorage.setItem('selectedGameFolder', path.resolve(folder.filePaths[0]));
        document.getElementById('game-directory-text-value').innerHTML = sessionStorage.getItem('selectedGameFolder');
    });
}

function createCustomGame(name) {
    var targetFolder = sessionStorage.getItem('selectedGameFolder');
    var gameTitle = document.getElementById('game-name-value').value.replace(/ /g, '-');

    if (!gameTitle || !targetFolder) return;

    addGameToLibrary(undefined, targetFolder, gameTitle);
    closeDialog(name);

    setTimeout(() => {
        goto('Installed');
    }, 100)

    sessionStorage.removeItem('selectedGameFolder');
}
