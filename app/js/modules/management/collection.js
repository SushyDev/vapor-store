const executables = require('./executables');
const manager = require('./manager');
const main = require('./main');

// ! Main
exports.openMore = (name, name2, gameDir, folderName) => main.openMore(name, name2, gameDir, folderName);
// ! Executables
exports.listGameExec = (gameTitle, gameFolder, folderName, launchDefault) => executables.listGameExec(gameTitle, gameFolder, folderName, launchDefault);
exports.listExec = () => executables.listExec();
// ! Manager
exports.addInstalledGame = () => manager.addInstalledGame();
exports.selectGameFolder = () => manager.selectGameFolder();
exports.createCustomGame = (name) => manager.createCustomGame(name);
exports.gameDelete = (gameTitle, gameFolder, folderName, launchDefault) => manager.gameDelete(gameTitle, gameFolder, folderName, launchDefault);
// # exports.gameRemove = () => manager.gameRemove()
