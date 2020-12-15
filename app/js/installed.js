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
            MDCAlert('No games installed', '', true);
            goto('Store');
        }

        //For every game in the list
        data['list'].forEach((game) => {
            //Stop if new search

            if (createCardId !== createCardLatest) return;

            //Format name for url

            //Fetch data from the game by name
            fetch(game.name).then((gameInfo) => {
                //Stop if new search or different page
                if (createCardId !== createCardLatest) return;
                if (page != sessionStorage.getItem('page')) return;
                var type = 'installed';

                gameInfo.folder = game.folder;
                gameInfo.fileName = game.fileName;
                gameInfo.name2 = game.name;

                buildCard(gameInfo, game.name, type);
            });
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
    });

    openDialog(`${name}-exec`);
    hideProgressBar();
}

function gamePlay(executable) {
    var exec = require('child_process').exec;
    exec(executable, function (err, data) {
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

    console.log(dialogData);
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
                var executable = path.join(subFolder, file);
                //Create exec button
                var shortcutButton = document.createElement('button');
                shortcutButton.className = 'mdc-button mdc-button--raised';
                shortcutButton.setAttribute('data-mdc-auto-init', 'MDCRipple');
                shortcutButton.setAttribute('onclick', `createShortcut('${JSON.stringify(executable)}')`);
                shortcutButton.innerHTML = `<div class="mdc-button__ripple"></div><span class="mdc-button__label">${file}</span>`;

                //Add button to content
                document.getElementById(`${name}-shortcut-dialog-content`).appendChild(shortcutButton);
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

    if (shortcutsCreated) {
        console.log('Everything worked correctly!');
    } else {
        console.log('Could not create the icon or set its permissions (in Linux if "chmod" is set to true, or not set)');
    }
}
