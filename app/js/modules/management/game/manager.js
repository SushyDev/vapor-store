// ? Delete the game
exports.gameDelete = (gameID, gameDir) => {
    if (!confirm(`Are you sure you want to delete ${gameID}`)) return;

    // ? delete game then remove from list
    rimraf(gameDir, () => manage.game.gameRemove(gameID, false));
};

// ? Remove the game from the installed games list
exports.gameRemove = (gameID, ask = true) => {
    if (ask == true)  if(!confirm(`Are you sure you want to remove ${gameID}`)) return;

    // ? Remove deleted game from list
    $.getJSON(vapor.fn.installedGames(), (data) => {
        const list = data['list'];

        // ? Make new array without the deleted key
        const key = vapor.fn.getKeyByValue(list, gameID);
        delete list[key];
        const newlist = {list: [...list]};
        newlist['list'] = newlist['list'].filter((n) => n);

        const hi = 'hi'

        // ? Save to library json file
        fs.writeFile(vapor.fn.installedGames(), JSON.stringify(newlist), (err) => (err ? console.log(err) : vapor.nav.goto('Installed')));
    });
};

/*
exports.addInstalledGame = () => {
    const name = 'add-game';
    const dialogData = {
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
</label>`,
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
</button>`,
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

    vapor.ui.dialog.create(dialogData);
};

exports.selectGameFolder = () => {
    const options = {
        title: 'Select Folder',
        properties: ['openDirectory'],
    };
    dialog.showOpenDialog(null, options).then(async (folder) => {
        sessionStorage.setItem('selectedGameFolder', path.resolve(folder.filePaths[0]));
        document.getElementById('game-directory-text-value').innerHTML = sessionStorage.getItem('selectedGameFolder');
    });
};

exports.createCustomGame = (name) => {
    const gameDir = sessionStorage.getItem('selectedGameFolder');
    const gameID = document.getElementById('game-name-value').value.replace(/ /g, '-');

    if (!gameID || !gameDir) return;

    addGameToLibrary(gameDir, gameID);
    closeDialog(name);

    setTimeout(() => vapor.nav.goto('Installed'), 100);

    sessionStorage.removeItem('selectedGameFolder');
};
*/
