// ! Returns path to library json file
exports.getKeyByValue = (array, type, value) => Object.keys(array).find((key) => array[key][type] === value);

// ! Get chromium path for windows/linux (Development is done on OpenSUSE)
exports.getChromiumExecPath = () => (process.platform == 'linux' ? puppeteer.executablePath() : puppeteer.executablePath().replace('app.asar', 'app.asar.unpacked'));

// ! Vapor Store files directory's
const vaporData = () => path.resolve(app.getPath('userData'));
const vaporFiles = () => path.join(vaporData(), 'Files');
const vaporConfigs = () => path.join(vaporFiles(), 'json');

// ! Main paths
exports.vaporFiles = () => vaporFiles();
exports.vaporConfigs = () => vaporConfigs();

// ! Sub paths
exports.vaporGames = () => path.join(vaporFiles(), 'games');
exports.vaporConfig = () => path.join(vaporConfigs(), 'config.json');
exports.vaporData = () => vaporData();

// ! Get the installed games file
exports.installedGames = () => path.join(vaporConfigs(), 'installed.json');

exports.vaporIcon = () => path.join(process.cwd(), 'assets/icons/png/icon.png');
