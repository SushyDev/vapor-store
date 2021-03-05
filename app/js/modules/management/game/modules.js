const executables = require('./executables');
const manager = require('./manager');
const shortcuts = require('./shortcuts');

// ! Main
// ? Open more options popup
exports.openMore = async (gameID) => {
    const installedGameList = await $.get(vapor.fn.installedGames());
    const gameKey = vapor.fn.getKeyByValue(installedGameList.list, 'id', gameID);
    const game = installedGameList.list[gameKey];

    const anchorpoint = document.querySelector(`div[anchorfor="${game.id}"]`);

    anchorpoint.innerHTML != ''
        ? (anchorpoint.innerHTML = '')
        : (anchorpoint.innerHTML = `
<div id="toolbar" class="toolbar mdc-menu-surface--anchor">
    <div class="mdc-menu mdc-menu-surface mdc-menu-surface--open">
        <ul class="mdc-list" role="menu" aria-hidden="true" aria-orientation="vertical" tabindex="-1">

        <!--
            <li class="mdc-list-item" role="menuitem" data-mdc-auto-init="MDCRipple" onclick="manage.game.selectDefault('${game.id}', '${encodeURI(game.directory)}')">
                <span class="mdc-list-item__ripple"></span>
                <span class="mdc-list-item__text">Select default exe</span>
            </li>
        -->

            <li class="mdc-list-item" role="menuitem" data-mdc-auto-init="MDCRipple" onclick="manage.game.listGameExec('${game.id}', '${encodeURI(game.directory)}', false)">
                <span class="mdc-list-item__ripple"></span>
                <span class="mdc-list-item__text">List executables</span>
            </li>
            <li class="mdc-list-item" role="menuitem" data-mdc-auto-init="MDCRipple" onclick="manage.game.gameShortcut('${game.id}', '${encodeURI(game.directory)}')">
                <span class="mdc-list-item__ripple"></span>
                <span class="mdc-list-item__text">Add to desktop</span>
            </li>
            <li class="mdc-list-item" role="menuitem" data-mdc-auto-init="MDCRipple" onclick="manage.game.openFolder('${encodeURI(game.directory)}')">
                <span class="mdc-list-item__ripple"></span>
                <span class="mdc-list-item__text">Open folder</span>
            </li>
            <li class="mdc-list-item" role="menuitem" data-mdc-auto-init="MDCRipple" onclick="manage.game.gameRemove('${game.id}')">
                <span class="mdc-list-item__ripple"></span>
                <span class="mdc-list-item__text">Remove</span>
            </li>
            <li class="mdc-list-item" role="menuitem" data-mdc-auto-init="MDCRipple" onclick="manage.game.gameDelete('${game.id}', '${encodeURI(game.directory)}')">
                <span class="mdc-list-item__ripple"></span>
                <span class="mdc-list-item__text">Delete</span>
            </li>
        </ul>
    </div>
</div>`);
};

// # Recursively get all files in directory
exports.getFiles = async (path = './') => {
    const entries = await fs.readdirSync(path, {withFileTypes: true});

    // ? Get files within the current directory and add a path key to the file objects
    const files = entries.filter((file) => file.name.endsWith('.exe') && !file.isDirectory()).map((file) => ({...file, path: require('path').join(path, file.name)}));

    // ? Get folders within the current directory
    const folders = entries.filter((folder) => folder.isDirectory());

    /*
          Add the found files within the subdirectory to the files array by calling the
          current function itself
        */

    for (const folder of folders) files.push(...(await manage.game.getFiles(require('path').join(path, folder.name))));

    console.log(files)

    return files;
};

// ! Manager
// # exports.addInstalledGame = () => manager.addInstalledGame();
// # exports.selectGameFolder = () => manager.selectGameFolder();
exports.createCustomGame = (name) => manager.createCustomGame(name);
exports.gameDelete = (gameID, gameDir) => manager.gameDelete(gameID, decodeURI(gameDir));
exports.gameRemove = (gameID, gameDir) => manager.gameRemove(gameID, decodeURI(gameDir));

// ! Executables
exports.listGameExec = (gameID, gameDir) => executables.listGameExec(gameID, decodeURI(gameDir));
exports.gamePlay = (gameDir, admin = false) => executables.gamePlay(decodeURI(gameDir), admin);

// ! Shortcuts
exports.gameShortcut = (gameID, gameDir) => shortcuts.gameShortcut(gameID, decodeURI(gameDir));
exports.createShortcut = (executable) => createDesktopShortcut({windows: {filePath: `${executable.replace(/"/g, '')}`}});

// ! Open folder containing game files
exports.openFolder = async (gameDir) => shell.openPath(decodeURI(gameDir));
