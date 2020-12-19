var file = path.join(appDataPath, '/Json/library.json');

var createCardLatest;
function createCard() {
    //Remove previous cards
    cards.innerHTML = '';
    showProgressBar();

    createCardLatest = Symbol();
    var createCardId = createCardLatest;
    var page = sessionStorage.getItem('page');

    //Read the store games list json file
    $.getJSON(file, (data) => {
        //Stop if new search
        if (createCardId !== createCardLatest) return;

        if (data['list'][0] == undefined) {
            MDCAlert('No games installed', 'Please install some games to continue');
            goto('Store');
        }

        //For every game in the list
        data['list'].forEach((game) => {
            //Stop if new search

            if (createCardId !== createCardLatest) return;

            //Format name for url

            var fileName = game.fileName;
            var gameFolder = game.folder;

            var fetchName = game.name.replace(/ /g, '-');
            //Fetch data from the game by name
            buildCard(fetchName, 'installed', fileName, gameFolder);
        });
    });
}
createCard();

//Create list of executables in game folder
function gameListExec(gameTitle, targetFolder, fileName) {
    const gameFolder = path.join(localStorage.getItem('downloadDir'), fileName.slice(0, -4));

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

    function getDirectories(path) {
        return fs.readdirSync(path).filter(function (file) {
            return fs.statSync(path + '/' + file).isDirectory();
        });
    }

    getDirectories(gameFolder).forEach((folderName) => {
        const subFolder = path.join(localStorage.getItem('downloadDir'), fileName.slice(0, -4), folderName);

        //Open dialog with executable list

        fs.readdirSync(subFolder).forEach((file) => {
            if (file.substr(file.length - 3) == 'exe') {
                var executable = path.join(subFolder, file);

                var buttonRow = document.createElement('div');
                buttonRow.classList = 'buttonrow';
                buttonRow.id = `${executable}-row`;
                //Create exec button
                var execButton = document.createElement('button');
                execButton.className = 'mdc-button mdc-button--raised';
                execButton.setAttribute('data-mdc-auto-init', 'MDCRipple');
                execButton.setAttribute('onclick', `gamePlay('${JSON.stringify(executable)}')`);
                execButton.innerHTML = `<div class="mdc-button__ripple"></div><span class="mdc-button__label">${file}</span>`;
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
    });

    openDialog(`${name}-exec`);
    hideProgressBar();
}

function gamePlay(executable) {
    var exec = require('child_process').exec;
    exec(executable, (err, data) => {
        console.log(err);
    });
}

function gamePlayAdmin(executable) {
    exec(`powershell -command "start-process \\"${executable.replace(/"/g, '')}\\" -verb runas`, (err, data) => {
        console.log(err);
    });
}

function gameDelete(gameTitle, targetFolder, fileName) {
    //Dont do it if canceled
    if (!confirm(`Are you sure you want to delete ${fileName.slice(0, -4)}`)) return;

    var file = path.join(appDataPath, '/Json/library.json');
    const subFolder = path.join(targetFolder, fileName.slice(0, -4));

    //delete folder from game
    rimraf(subFolder, function () {
        //Remove deleted game from list
        $.getJSON(file, (data) => {
            var list = data['list'];

            //Function for getting key from game name
            function getKeyByValue(object, value) {
                return Object.keys(object).find((key) => {
                    return object[key].name === gameTitle;
                });
            }

            //Get key from game name
            var key = getKeyByValue(list, gameTitle);

            //Remove key corresponding to the game name
            delete list[key];

            //Make new array without the deleted key
            var newlist = {list: [...list]};

            //Remove undefined values
            newlist['list'] = newlist['list'].filter((n) => n);

            //Save to library json file
            fs.writeFile(file, JSON.stringify(newlist), function (err) {
                if (err) throw err;
                devLog('Saved!');
                goto('Installed');
            });
        });
    });
}

//List all executables in folder (includes all subfolders)
function getDirectories(gameFolder) {
    const subFolder = localStorage.getItem('downloadDirectory') + folder + '/' + folderName;

    fs.readdirSync(subFolder).forEach((file) => {
        if (file.substr(file.length - 3) == 'exe') {
            var executable = path.join(subFolder, file);
            //Create exec button
            var execButton = document.createElement('button');
            execButton.className = 'mdc-button mdc-button--raised';
            execButton.setAttribute('data-mdc-auto-init', 'MDCRipple');
            execButton.setAttribute('onclick', `gamePlay('${JSON.stringify(executable)}')`);
            execButton.innerHTML = `<div class="mdc-button__ripple"></div><span class="mdc-button__label">${file}</span>`;

            //Add button to content
            document.getElementById(`${name}-exec-dialog-content`).appendChild(execButton);
            window.mdc.autoInit();
        }
    });
}

function openFolder(folder, filename) {
    shell.showItemInFolder(path.join(folder, filename.slice(0, -4)));
}

//List exe's to create shortcut
function gameShortcut(gameTitle, targetFolder, fileName) {
    const gameFolder = path.join(localStorage.getItem('downloadDir'), fileName.slice(0, -4));

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

    function getDirectories(path) {
        return fs.readdirSync(path).filter(function (file) {
            return fs.statSync(path + '/' + file).isDirectory();
        });
    }

    getDirectories(gameFolder).forEach((folderName) => {
        const subFolder = path.join(localStorage.getItem('downloadDir'), fileName.slice(0, -4), folderName);

        fs.readdirSync(subFolder).forEach((file) => {
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
                shortcutButton.innerHTML = `<div class="mdc-button__ripple"></div><span class="mdc-button__label">${file}</span>`;

                //Add button to content
                document.getElementById(`${name}-shortcut-dialog-content`).appendChild(buttonRow);
                document.getElementById(`${shortcut}-row`).appendChild(shortcutButton);
                window.mdc.autoInit();
            }
        });
    });

    openDialog(`${name}-shortcut`);
    hideProgressBar();
}

function createShortcut(executable) {
    const shortcutsCreated = createDesktopShortcut({
        windows: {filePath: `${executable.replace(/"/g, '')}`},
    });

    shortcutsCreated;
}
