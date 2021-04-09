const fetch = require('./fetch');


exports.startDownload = (url, dir, gameTitle) => require('./downloader').startDownload(url, dir, gameTitle);
exports.fetchDownload = (gameTitle) => fetch.fetchDownload(gameTitle);
exports.extractDownload = (targetPath, targetFolder, gameTitle) => require('./extractor').extractDownload(targetPath, targetFolder, gameTitle);
exports.getFetching = () => fetch.getFetching();
exports.addGameToLibrary = (targetPath, targetFolder, gameTitle) => require('./finished').addGameToLibrary(targetPath, targetFolder, gameTitle);

exports.item = require('./page/item');
