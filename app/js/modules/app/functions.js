// ! Returns path to library json file
exports.getKeyByValue = (array, value) => Object.keys(array).find((key) => array[key].name === value);

// ! Get chromium path for windows/linux (Development is done on OpenSUSE)
exports.getChromiumExecPath = () => (process.platform == 'linux' ? puppeteer.executablePath() : puppeteer.executablePath().replace('app.asar', 'app.asar.unpacked'));

// ! Vapor Store files directory's
const vaporFiles = () => path.join(appDataPath, 'Files');
const vaporConfig = () => path.join(vaporFiles(), 'json');

exports.vaporFiles = () => vaporFiles();
exports.vaporConfig = () => vaporConfig();

// ! Get the installed games file
exports.installedGames = () => path.join(vaporConfig(), 'installed.json');

console.log(`Storing files in ${vaporConfig()}`);

exports.vaporIcon = () => path.join(process.cwd(), 'assets/icons/png/icon.png');
