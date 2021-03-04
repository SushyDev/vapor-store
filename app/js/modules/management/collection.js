const executables = require('./executables');
const manager = require('./manager');

// ! Main
//Open more options popup
exports.openMore = (name, name2, gameDir, folderName) => {
    const anchorpoint = document.querySelector(`div[anchorfor="${name}"]`);

    anchorpoint.innerHTML != ''
        ? (anchorpoint.innerHTML = '')
        : (anchorpoint.innerHTML = `
<div id="toolbar" class="toolbar mdc-menu-surface--anchor">
    <div class="mdc-menu mdc-menu-surface mdc-menu-surface--open">
        <ul class="mdc-list" role="menu" aria-hidden="true" aria-orientation="vertical" tabindex="-1">
            <li class="mdc-list-item" role="menuitem" data-mdc-auto-init="MDCRipple" onclick="selectDefault('${name2}', '${gameDir}', '${folderName}')">
                <span class="mdc-list-item__ripple"></span>
                <span class="mdc-list-item__text">Select default exe</span>
            </li>
            <li class="mdc-list-item" role="menuitem" data-mdc-auto-init="MDCRipple" onclick="gameListExec('${name}', '${gameDir}', '${folderName}', false)">
                <span class="mdc-list-item__ripple"></span>
                <span class="mdc-list-item__text">List executables</span>
            </li>
            <li class="mdc-list-item" role="menuitem" data-mdc-auto-init="MDCRipple" onclick="gameShortcut('${name}', '${gameDir}', '${folderName}')">
                <span class="mdc-list-item__ripple"></span>
                <span class="mdc-list-item__text">Add to desktop</span>
            </li>
            <li class="mdc-list-item" role="menuitem" data-mdc-auto-init="MDCRipple" onclick="management.game.openFolder('${folderName}')">
                <span class="mdc-list-item__ripple"></span>
                <span class="mdc-list-item__text">Open folder</span>
            </li>
            <li class="mdc-list-item" role="menuitem" data-mdc-auto-init="MDCRipple" onclick="management.game.gameDelete('${name2}', '${gameDir}', '${folderName}')">
                <span class="mdc-list-item__ripple"></span>
                <span class="mdc-list-item__text">Delete</span>
            </li>
        </ul>
    </div>
</div>`);
};

// ! Executables
exports.listGameExec = (gameTitle, gameFolder, folderName, launchDefault) => executables.listGameExec(gameTitle, gameFolder, folderName, launchDefault);
exports.listExec = () => executables.listExec();
// ! Manager
exports.addInstalledGame = () => manager.addInstalledGame();
exports.selectGameFolder = () => manager.selectGameFolder();
exports.createCustomGame = (name) => manager.createCustomGame(name);
exports.gameDelete = (gameTitle, gameFolder, folderName, launchDefault) => manager.gameDelete(gameTitle, gameFolder, folderName, launchDefault);
// # exports.gameRemove = () => manager.gameRemove()

// ! Open folder containing game files
exports.openFolder = async (folder) => shell.openPath(path.join(vapor.config.get().downloadDir, folder));
