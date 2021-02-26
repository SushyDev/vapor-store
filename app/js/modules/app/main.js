exports.Initialize = () => {
    // ? If no download directory is set, set to vapor store default
    if (!downloadDir) localStorage.setItem('downloadDir', path.join(appDataPath, 'Games'));

    // ? If no theme preference is set then default to darkmode
    if (!darkMode) localStorage.setItem('darkMode', true);

    // ? If no beta preference is set, check if current version is beta and set default accordingly
    if (!optBeta) app.getVersion().includes('beta') ? localStorage.setItem('beta', true) : localStorage.setItem('beta', false);

    const file = vapor.fn.installedGames();
    // ? If library json file doesnt exist make it (and make the folder if it doesnt exist)
    fs.readFile(file, 'utf-8', (err) => {
        if (err) checkDir();
    });

    // ? Check if config folder exists, if not then create folder, then check for the installed file
    const checkDir = () => fs.exists(vapor.fn.vaporConfig(), (err) => fs.mkdir(vapor.fn.vaporConfig(), {recursive: true}, (err) => (err ? console.log('Directories', err) : checkList())));

    // ? Check if json file exists, if not then make it
    const checkList = () => {
        fs.readFile(file, 'utf-8', (err) => {
            if (err)
                fs.writeFile(file, JSON.stringify({list: []}), (err) => {
                    if (err) console.log('File', err);
                });
        });
    };

    // ? If isn't in dev envroinmnet then check o
    if (!isDev) vapor.app.fetchUpdate();

    // ? Set theme
    vapor.settings.theme.checkTheme();

    $(document).ready(() => vapor.nav.goto());
};

exports.fetchUpdate = () => {
    $.get('https://api.github.com/repos/SushyDev/vapor-store/releases', function (data) {
        const release = data[0];
        const isExe = release.assets.find((asset) => asset.name.endsWith('exe'));

        const downloadUrl = isExe ? isExe.browser_download_url : undefined;
        const fileName = isExe ? isExe.name : undefined;

        const name = fileName.slice(0, -4);
        const latest = release.tag_name.slice(1);
        const current = app.getVersion();

        const snackbarData = {
            ['main']: [
                {
                    name: `${name}`,
                },
            ],
            ['progress']: [
                {
                    enabled: false,
                    id: `${name}-completed-progress`,
                },
            ],
            ['label']: [
                {
                    id: `${name}-snackbar-title`,
                    innerHTML: `Version ${latest} is available`,
                },
            ],
            ['actions']: [
                {
                    type: 'button',
                    innerHTML: 'Download',
                    labelid: `${name}-download-button__label`,
                    class: 'download-button',
                    id: 'download-button',
                    onclick: `downloadUpdate('${name}', '${downloadUrl}')`,
                },
            ],
            ['close']: [
                {
                    enabled: true,
                    onclick: `closeSnackbar('${name}', false)`,
                    title: 'Dismiss',
                    icon: 'close',
                    id: `${name}-close`,
                },
            ],
        };

        // ? Current Beta Number
        const currentBN = current.split('-beta-').pop();

        // ? Latest Beta Number
        const latestBN = latest.split('-beta-').pop();

        // ? Curent Version Number
        const currentVN = current.split('-beta-')[0];

        // ? Latest Version Number
        const latestVN = latest.split('-beta-')[0];

        // ! Check for updates
        current.includes('beta') && latest.includes('beta') ? bothAreBeta() : current.includes('beta') ? currentIsBeta() : latest.includes('beta') ? latestIsBeta() : noneIsBeta();

        // ! Check if there is update
        const bothAreBeta = () => (latestVN > currentVN ? updateAvailable(true) : parseInt(latestBN) > parseInt(currentBN) ? updateAvailable(true) : undefined);
        const currentIsBeta = () => (latest == currentVN ? updateAvailable() : latest > currentVN ? updateAvailable() : undefined);
        const latestIsBeta = () => (latestVN > current ? updateAvailable(true) : undefined);
        const noneIsBeta = () => (latest > current ? updateAvailable() : undefined);

        // ! When update is available
        const updateAvailable = (beta) => (localStorage.getItem('beta') == 'false' && beta == true) || createSnack(snackbarData);
    });
};

function downloadUpdate(name, downloadUrl) {
    closeSnackbar(name, false);
    startDownload(downloadUrl, localStorage.getItem('downloadDir'), 'vapor-store-update');
}

//On download complete
exports.installUpdate = async (fileName) => {
    //Run exe
    await setTimeout(async () => {
        await exec(`start "" "${path.join(localStorage.getItem('downloadDir'), fileName)}`);
    }, 250);
};

const getWindow = () => remote.BrowserWindow.getFocusedWindow();

exports.Window = () => getWindow();

exports.Minimize = () => getWindow().minimize();

exports.Maximize = () => (getWindow().isMaximized() ? getWindow().unmaximize() : getWindow().maximize());

exports.Close = () => getWindow().close();
