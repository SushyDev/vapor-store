exports.Initialize = () => {
    vapor.config.Initialize();

    const FILE = vapor.fn.installedGames();
    // ? If library json file doesnt exist make it (and make the folder if it doesnt exist)
    fs.readFile(FILE, 'utf-8', (err, data) => {
        if (err) overwriteInstalled();
        try {
            JSON.parse(data);
        } catch (e) {
            overwriteInstalled();
        }
    });

    // ? Check if json file exists, if not then make it
    const overwriteInstalled = () => {
        fs.writeFile(FILE, JSON.stringify({list: []}), (err) => {
            if (err) console.log('File', err);
        });
    };

    // ? If isn't in dev envroinmnet then check o
    if (!isDev) vapor.app.fetchUpdate();

    // ? Set theme
    vapor.settings.theme.checkTheme();

    $(document).ready(() => vapor.nav.goto());
};

exports.fetchUpdate = () => {
    $.get('https://api.github.com/repos/SushyDev/vapor-store/releases', (data) => {
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
                    onclick: `vapor.app.getUpdate('${name}', '${downloadUrl}')`,
                },
            ],
            ['close']: [
                {
                    enabled: true,
                    onclick: `vapor.ui.snackbar.close('${name}', false)`,
                    title: 'Dismiss',
                    icon: 'close',
                    id: `${name}-close`,
                },
            ],
        };

        // ? Curent Alpha Version Number
        const currentAN = current.split('-alpha-').pop();

        // ? Latest Alpha Version Number
        const latestAN = latest.split('-alpha-').pop();

        // ? Current Beta Number
        const currentBN = current.split('-beta-').pop();

        // ? Latest Beta Number
        const latestBN = latest.split('-beta-').pop();

        // ? Curent Version Number
        const currentVN = current.split('-beta-')[0];

        // ? Latest Version Number
        const latestVN = latest.split('-beta-')[0];

        // ! When update is available
        const updateAvailable = (beta) => (!vapor.config.get().optBeta && beta) || vapor.ui.snackbar.create(snackbarData);

        // ! When alpha update is available
        current.includes('alpha') && latest.includes('alpha') && latestAN > currentAN && updateAvailable();

        // ! Check if there is update
        const noneIsBeta = () => (latest > current ? updateAvailable() : undefined);
        const bothAreBeta = () => (latestVN > currentVN ? updateAvailable(true) : parseInt(latestBN) > parseInt(currentBN) ? updateAvailable(true) : undefined);
        const currentIsBeta = () => (latest == currentVN ? updateAvailable() : latest > currentVN ? updateAvailable() : undefined);
        const latestIsBeta = () => (latestVN > current ? updateAvailable(true) : undefined);

        // ! Check for updates
        current.includes('beta') && latest.includes('beta') ? bothAreBeta() : current.includes('beta') ? currentIsBeta() : latest.includes('beta') ? latestIsBeta() : noneIsBeta();
    });
};

exports.getUpdate = (name, downloadUrl) => {
    vapor.ui.snackbar.close(name, false);
    downloader.startDownload(downloadUrl, vapor.fn.vaporGames(), 'vapor-store-update');
};

// ? Run exe
exports.runExe = async (path) => await setTimeout(async () => await exec(`start "" "${path}`), 250);

const getWindow = () => remote.BrowserWindow.getFocusedWindow();

exports.Window = () => getWindow();

exports.Minimize = () => getWindow().minimize();

exports.Maximize = () => (getWindow().isMaximized() ? getWindow().unmaximize() : getWindow().maximize());

exports.Close = () => getWindow().close();
