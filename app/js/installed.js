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
            alert('No games installed');
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

    //Clear dialog
    document.getElementById('exec-dialog-content').innerHTML = '';

    function getDirectories(path) {
        return fs.readdirSync(path).filter(function (file) {
            return fs.statSync(path + '/' + file).isDirectory();
        });
    }

    getDirectories(gameFolder).forEach((folderName) => {
        const subFolder = path.join(localStorage.getItem('downloadDir'), fileName.slice(0, -4), folderName);
        const fs = require('fs');

        //Open dialog with executable list
        openDialog('exec-dialog');
        document.getElementById('exec-dialog-title').innerHTML = 'Executables';

        fs.readdirSync(subFolder).forEach((file) => {
            if (file.substr(file.length - 3) == 'exe') {
                var executable = path.join(subFolder, file);
                //Create exec button
                var execButton = document.createElement('button');
                execButton.className = 'mdc-button mdc-button--raised';
                execButton.setAttribute('onclick', `gamePlay('${JSON.stringify(executable)}')`);

                var execButtonName = document.createElement('span');
                execButtonName.innerHTML = file;

                execButton.appendChild(execButtonName);

                //Add button to content
                document.getElementById('exec-dialog-content').appendChild(execButton);
                window.mdc.autoInit();
            }
        });
    });
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
    const fs = require('fs');

    fs.readdirSync(subFolder).forEach((file) => {
        if (file.substr(file.length - 3) == 'exe') {
            var executable = subFolder + '/' + file;

            var startButton = document.createElement('p');
            startButton.innerHTML = file.replace('.exe', '');
            startButton.className = 'game-exe-list';
            startButton.setAttribute('onclick', 'startGame(' + "'" + executable + "'" + ')');

            document.getElementById('game-cover-download').appendChild(startButton);
        }
    });
}

function openFolder(folder, filename) {
    shell.showItemInFolder(path.join(folder, filename.slice(0, -4)));
}

function gameShortcut(gameTitle, targetFolder, fileName) {
    console.log(gameTitle, targetFolder, fileName);
    const gameFolder = path.join(localStorage.getItem('downloadDir'), fileName.slice(0, -4));

    //Clear dialog
    document.getElementById('exec-dialog-content').innerHTML = '';

    openDialog('exec-dialog');
    document.getElementById('exec-dialog-title').innerHTML = 'Create shortcut';

    function getDirectories(path) {
        return fs.readdirSync(path).filter(function (file) {
            return fs.statSync(path + '/' + file).isDirectory();
        });
    }

    getDirectories(gameFolder).forEach((folderName) => {
        const subFolder = path.join(localStorage.getItem('downloadDir'), fileName.slice(0, -4), folderName);
        const fs = require('fs');

        //Open dialog with executable list
        openDialog('exec-dialog');

        fs.readdirSync(subFolder).forEach((file) => {
            if (file.substr(file.length - 3) == 'exe') {
                var executable = path.join(subFolder, file);
                //Create exec button
                var execButton = document.createElement('button');
                execButton.className = 'mdc-button mdc-button--raised';
                execButton.setAttribute('onclick', `createShortcut('${JSON.stringify(executable)}')`);

                var execButtonName = document.createElement('span');
                execButtonName.innerHTML = file;

                execButton.appendChild(execButtonName);

                //Add button to content
                document.getElementById('exec-dialog-content').appendChild(execButton);
                window.mdc.autoInit();
            }
        });
    });
}

function createShortcut(executable) {
    const shortcutsCreated = createDesktopShortcut({
        windows: {filePath: executable.replace(/\\/g, '/')},
        linux: {filePath: executable},
        osx: {filePath: executable},
    });

    if (shortcutsCreated) {
        console.log('Everything worked correctly!');
    } else {
        console.log('Could not create the icon or set its permissions (in Linux if "chmod" is set to true, or not set)');
    }
}
